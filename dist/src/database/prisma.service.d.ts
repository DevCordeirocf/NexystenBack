import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TenantContextService } from '../tenant/tenant-context.service';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly tenantContextService;
    constructor(tenantContextService: TenantContextService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
