import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(request: Request & { requestId?: string }, response: Response, next: NextFunction) {
    let id: string;
    try {
      id = (randomUUID && typeof randomUUID === 'function') ? randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    } catch (err) {
      id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    }

    request.requestId = id;
    response.setHeader('X-Request-Id', id);

    next();
  }
}
