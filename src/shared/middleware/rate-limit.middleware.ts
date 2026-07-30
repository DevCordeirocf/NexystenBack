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

  use(request: Request, response: Response, next: NextFunction) {
    const rule = this.rules.find((item) => item.match(request));

    if (!rule) {
      next();
      return;
    }

    const now = Date.now();
    const clientIp = this.getClientIp(request);
    const key = `${rule.name}:${clientIp}`;
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
    // Rely on Express' request.ip which respects the app's "trust proxy" setting.
    // Do NOT trust X-Forwarded-For directly here unless you have validated the
    // upstream proxy is trusted. The application config (src/main.ts) should
    // configure `app.set('trust proxy', ...)` appropriately for your deployment.
    const ip = (request as any).ip || request.socket.remoteAddress || 'unknown';
    return ip as string;
  }
}
