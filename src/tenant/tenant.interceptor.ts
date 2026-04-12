import { CallHandler, ExecutionContext, ForbiddenException, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantContextService } from './tenant-context.service';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(
    private readonly tenantContextService: TenantContextService,
    private readonly prisma: PrismaService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const tenantHeader = request.headers['x-tenant-id'] as string;
    const url = request.url;

    // Lista de rotas que não exigem obrigatoriamente o X-Tenant-ID
    const isPublicRoute = url.includes('/auth/login') || 
                         url.includes('/auth/register') || 
                         url.includes('/tenant-admin') ||
                         url.includes('/tenants/public');

    if (!tenantHeader && !isPublicRoute) {
      throw new ForbiddenException('X-Tenant-ID é necessário no header');
    }

    return new Observable(subscriber => {
      if (tenantHeader) {
        // Tenta resolver o tenantHeader (que pode ser Nome ou UUID) para o UUID real
        this.resolveTenantId(tenantHeader).then(resolvedId => {
          if (!resolvedId && !isPublicRoute) {
             subscriber.error(new ForbiddenException('Tenant inválido ou não encontrado.'));
             return;
          }

          if (resolvedId) {
            this.tenantContextService.run(resolvedId, () => {
              this.executeNext(next, subscriber);
            });
          } else {
            this.executeNext(next, subscriber);
          }
        }).catch(err => subscriber.error(err));
      } else {
        this.executeNext(next, subscriber);
      }
    });
  }

  /**
   * Resolve o cabeçalho X-Tenant-ID para um UUID válido.
   * Aceita tanto o UUID quanto o Nome (subdomínio) da loja.
   */
  private async resolveTenantId(identifier: string): Promise<string | null> {
    // Verifica se já é um UUID válido (formato simplificado)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
    
    if (isUuid) return identifier;

    // Se não for UUID, busca pelo nome (subdomínio)
    const tenant = await this.prisma.tenantStore.findUnique({
      where: { name: identifier },
      select: { id: true }
    });

    return tenant?.id || null;
  }

  private executeNext(next: CallHandler, subscriber: any) {
    next.handle().subscribe({
      next: (value) => subscriber.next(value),
      error: (err) => subscriber.error(err),
      complete: () => subscriber.complete(),
    });
  }
}
