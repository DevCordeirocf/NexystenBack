import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

type RateLimitRule = {
  name: string;
  windowMs: number;
  maxRequests: number;
  match: (request: Request) => boolean;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly logger = new (class { log = console.log; error = console.error })();
  private redisClient: import('ioredis').Redis | null = null;
  private readonly hits = new Map<string, RateLimitEntry>();

  private readonly rules: RateLimitRule[] = [
    {
      name: 'auth-login',
      windowMs: 15 * 60 * 1000,
      maxRequests: 10,
      match: (request) => request.method === 'POST' && request.path === '/auth/login',
    },
    {
      name: 'public-write',
      windowMs: 60 * 60 * 1000,
      maxRequests: 30,
      match: (request) =>
        request.method === 'POST' &&
        ['/auth/register-customer', '/contact-requests'].includes(request.path),
    },
    {
      name: 'upload',
      windowMs: 60 * 60 * 1000,
      maxRequests: 60,
      match: (request) => request.method === 'POST' && request.path.startsWith('/upload'),
    },
  ];

  constructor() {
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
      try {
        // lazy-import to avoid requiring ioredis when not needed
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const IORedis = require('ioredis');
        this.redisClient = new IORedis(redisUrl);
        this.logger.log('RateLimitMiddleware: connected to Redis');
      } catch (err) {
        this.logger.error('RateLimitMiddleware: failed to init Redis client, falling back to in-memory', err);
        this.redisClient = null;
      }
    }
  }

  async use(request: Request, response: Response, next: NextFunction) {
    const rule = this.rules.find((item) => item.match(request));

    if (!rule) {
      next();
      return;
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
          response.setHeader('Retry-After', String(retryAfterSeconds));
          response.status(429).json({
            statusCode: 429,
            message: 'Muitas requisicoes. Tente novamente mais tarde.',
            retryAfterSeconds,
          });
          return;
        }

        next();
        return;
      } catch (err) {
        // If Redis fails unexpectedly, log and fall back to in-memory behavior
        this.logger.error('RateLimitMiddleware: Redis error, falling back to in-memory limiter', err);
      }
    }

    // Fallback in-memory implementation (per-instance)
    const now = Date.now();
    const entry = this.hits.get(key);

    if (!entry || entry.resetAt <= now) {
      this.hits.set(key, { count: 1, resetAt: now + rule.windowMs });
      next();
      return;
    }

    if (entry.count >= rule.maxRequests) {
      const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
      response.setHeader('Retry-After', String(retryAfterSeconds));
      response.status(429).json({
        statusCode: 429,
        message: 'Muitas requisicoes. Tente novamente mais tarde.',
        retryAfterSeconds,
      });
      return;
    }

    entry.count += 1;
    next();
  }

  private getClientIp(request: Request) {
    const ip = (request as any).ip || request.socket.remoteAddress || 'unknown';
    return ip as string;
  }
}
  