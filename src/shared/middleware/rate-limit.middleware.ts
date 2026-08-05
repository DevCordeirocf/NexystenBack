import { Injectable, NestMiddleware, HttpException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from 'nestjs-pino';

type RateLimitRule = {
  name: string;
  windowMs: number;
  maxRequests: number;
  match: (path: string, request: Request) => boolean;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private redisClient: any | null = null;
  private readonly hits = new Map<string, RateLimitEntry>();

  private readonly rules: RateLimitRule[] = [
    {
      name: 'auth-login',
      windowMs: 15 * 60 * 1000,
      maxRequests: 10,
      match: (path, request) => request.method === 'POST' && path === '/auth/login',
    },
    {
      name: 'public-write',
      windowMs: 60 * 60 * 1000,
      maxRequests: 30,
      match: (path, request) =>
        request.method === 'POST' &&
        ['/auth/register-customer', '/contact-requests'].includes(path),
    },
    {
      name: 'upload',
      windowMs: 60 * 60 * 1000,
      maxRequests: 60,
      match: (path, request) => request.method === 'POST' && path.startsWith('/upload'),
    },
  ];

  constructor(private readonly logger: Logger) {
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
      try {
        // lazy-import to avoid requiring ioredis when not needed
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const IORedis = require('ioredis');
        this.redisClient = new IORedis(redisUrl);
        this.logger.log('RateLimitMiddleware: connected to Redis');
      } catch (err) {
        this.logger.error('RateLimitMiddleware: failed to init Redis client, falling back to in-memory', { err: String(err) });
        this.redisClient = null;
      }
    }
  }

  async use(request: Request & { requestId?: string }, _response: Response, _next: NextFunction) {
    const normalizedPath = this.getRequestPath(request);
    const rule = this.rules.find((item) => item.match(normalizedPath, request));

    if (!rule) {
      return _next();
    }

    const clientIp = this.getClientIp(request);
    const key = `${rule.name}:${clientIp}`;

    if (this.redisClient) {
      try {
        // Use Redis INCR with EXPIRE to manage counts atomically
        const windowSeconds = Math.ceil(rule.windowMs / 1000);
        const count = await this.redisClient.incr(key);
        if (count === 1) {
          await this.redisClient.expire(key, windowSeconds);
        }
 
        if (count > rule.maxRequests) {
          const ttl = await this.redisClient.ttl(key);
          const retryAfterSeconds = ttl > 0 ? ttl : windowSeconds;
          this.logger.warn({ rule: rule.name, clientIp, requestId: request.requestId, retryAfterSeconds }, 'Rate limit exceeded');
          throw new HttpException({ statusCode: 429, message: 'Muitas requisicoes. Tente novamente mais tarde.', retryAfterSeconds }, 429);
        }
 
        return _next();
      } catch (err) {
        if (err instanceof HttpException) {
          throw err;
        }
        // If Redis fails unexpectedly, log and fall back to in-memory behavior
        this.logger.error({ err: String(err), requestId: request.requestId }, 'RateLimitMiddleware: Redis error, falling back to in-memory limiter');
      }
    }

    // Fallback in-memory implementation (per-instance)
    const now = Date.now();
    const entry = this.hits.get(key);

    if (!entry || entry.resetAt <= now) {
      this.hits.set(key, { count: 1, resetAt: now + rule.windowMs });
      return _next();
    }

    if (entry.count >= rule.maxRequests) {
      const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
      this.logger.warn({ rule: rule.name, clientIp, requestId: request.requestId, retryAfterSeconds }, 'Rate limit exceeded (in-memory)');
      throw new HttpException({ statusCode: 429, message: 'Muitas requisicoes. Tente novamente mais tarde.', retryAfterSeconds }, 429);
    }

    entry.count += 1;
    return _next();
  }

  private getClientIp(request: Request) {
    const forwarded = request.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.length > 0) {
      return forwarded.split(',')[0].trim();
    }

    const ip = (request as any).ip || request.socket.remoteAddress || 'unknown';
    return ip as string;
  }

  private getRequestPath(request: Request) {
    const rawPath =
      request.originalUrl ||
      `${(request as any).baseUrl || ''}${request.url || ''}` ||
      request.path ||
      '';

    return rawPath.split('?')[0];
  }
}

  