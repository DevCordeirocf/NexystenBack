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
    const tenantHeader = request.headers['x-tenant-id'] as string | undefined;
    const authenticatedTenantId = request.user?.tenantId as string | undefined;
    const url = request.url;

    const isTenantOptionalRoute =
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/tenant-admin') ||
      url.includes('/tenants/public') ||
      url.includes('/dev/tenants') ||
      url.includes('/api');

    const tenantIdentifier = authenticatedTenantId || tenantHeader;

    if (!tenantIdentifier && !isTenantOptionalRoute) {
      throw new ForbiddenException('Tenant ID nao disponivel no token ou no header X-Tenant-ID');
    }

    return new Observable(subscriber => {
      if (tenantIdentifier) {
        // Authenticated requests use the JWT tenant. Public storefront requests can still use the header.
        this.resolveTenantId(tenantIdentifier)
          .then(resolvedId => {
            if (!resolvedId && !isTenantOptionalRoute) {
              subscriber.error(new ForbiddenException('Tenant invalido ou nao encontrado.'));
              return;
            }

            if (resolvedId) {
              request.tenantId = resolvedId;
              this.tenantContextService.run(resolvedId, () => {
                this.executeNext(next, subscriber);
              });
              return;
            }

            this.executeNext(next, subscriber);
          })
          .catch(err => subscriber.error(err));
      } else {
        this.executeNext(next, subscriber);
      }
    });
  }

  private async resolveTenantId(identifier: string): Promise<string | null> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

    const tenant = await this.prisma.tenantStore.findUnique({
      where: isUuid ? { id: identifier } : { name: identifier },
      select: { id: true },
    });

    return tenant?.id || null;
  }

  private executeNext(next: CallHandler, subscriber: any) {
    next.handle().subscribe({
      next: value => subscriber.next(value),
      error: err => subscriber.error(err),
      complete: () => subscriber.complete(),
    });
  }
}
