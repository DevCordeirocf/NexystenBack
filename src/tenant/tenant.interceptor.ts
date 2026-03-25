import { Injectable, NestInterceptor, ExecutionContext, CallHandler, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantContextService } from './tenant-context.service';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(private readonly tenantContextService: TenantContextService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const tenantId = request.headers['x-tenant-id'] as string;

    if (!tenantId) {
      // Para rotas públicas que não exigem tenantId, podemos permitir que passem
      // No entanto, para rotas protegidas, isso deve ser tratado por um Guard de autenticação/autorização
      // Por enquanto, vamos forçar o tenantId para todas as rotas que usam este interceptor
      throw new ForbiddenException('X-Tenant-ID header is required.');
    }

    // Aqui, o tenantId do usuário autenticado (se houver) deveria ser validado contra o X-Tenant-ID
    // Por enquanto, apenas definimos o contexto com o X-Tenant-ID
    return new Observable(subscriber => {
      this.tenantContextService.run(tenantId, () => {
        next.handle().subscribe({
          next: (value) => subscriber.next(value),
          error: (err) => subscriber.error(err),
          complete: () => subscriber.complete(),
        });
      });
    });
  }
}
