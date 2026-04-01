import { Injectable, NestInterceptor, ExecutionContext, CallHandler, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantContextService } from './tenant-context.service';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(private readonly tenantContextService: TenantContextService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const tenantId = request.headers['x-tenant-id'] as string;
    const url = request.url;

    // Lista de rotas que não exigem obrigatoriamente o X-Tenant-ID (ex: Login Global, Registro de Admin)
    const isPublicRoute = url.includes('/auth/login') || 
                         url.includes('/auth/register') || 
                         url.includes('/tenant-admin');

    if (!tenantId && !isPublicRoute) {
      throw new ForbiddenException('X-Tenant-ID header is required.');
    }

    // Se não houver tenantId (como no caso do Master Admin), iniciamos o contexto como vazio ou nulo
    // O TenantContextService deve ser capaz de lidar com isso
    return new Observable(subscriber => {
      // Se houver tenantId, rodamos no contexto dele. Se não, rodamos sem contexto (para rotas globais)
      if (tenantId) {
        this.tenantContextService.run(tenantId, () => {
          this.executeNext(next, subscriber);
        });
      } else {
        // Para rotas globais sem tenantId, apenas seguimos o fluxo
        this.executeNext(next, subscriber);
      }
    });
  }

  private executeNext(next: CallHandler, subscriber: any) {
    next.handle().subscribe({
      next: (value) => subscriber.next(value),
      error: (err) => subscriber.error(err),
      complete: () => subscriber.complete(),
    });
  }
}
