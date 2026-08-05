import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { tenantStore } from '../../tenant/tenant-context.service';
import { randomUUID } from 'crypto';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(request: Request & { requestId?: string }, _response: Response, next: NextFunction) {
    const requestId = (request.requestId as string) || (request.headers['x-request-id'] as string) || (() => {
      try { return randomUUID(); } catch { return `${Date.now()}-${Math.random().toString(36).slice(2,10)}`; }
    })();

    // Ensure requestId is present both on request object and in AsyncLocalStorage
    request.requestId = requestId;

    // If there is already a tenantId in the current ALS store, preserve it
    const current = tenantStore.getStore();
    const tenantId = current?.tenantId;

    tenantStore.run({ tenantId, requestId }, () => next());
  }
}
