import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantContextService } from './tenant-context.service';
import { PrismaService } from '../database/prisma.service';
export declare class TenantInterceptor implements NestInterceptor {
    private readonly tenantContextService;
    private readonly prisma;
    constructor(tenantContextService: TenantContextService, prisma: PrismaService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private resolveTenantId;
    private executeNext;
}
