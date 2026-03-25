import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TenantContextService } from '../tenant/tenant-context.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly tenantContextService: TenantContextService) {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.$use(async (params, next) => {
      const tenantId = this.tenantContextService.getTenantId();
      if (tenantId) {
        if (params.model && ["Product", "ContactRequest"].includes(params.model)) {
          if (params.action === "findUnique" || params.action === "findFirst") {
            params.args.where = { ...params.args.where, tenantId };
          } else if (params.action === "findMany" || params.action === "count") {
            params.args.where = { ...params.args.where, tenantId };
          } else if (params.action === "create") {
            params.args.data = { ...params.args.data, tenantId };
          } else if (params.action === "update" || params.action === "updateMany") {
            params.args.where = { ...params.args.where, tenantId };
          } else if (params.action === "delete" || params.action === "deleteMany") {
            params.args.where = { ...params.args.where, tenantId };
          }
        }
      }
      return next(params);
    });
    console.log("✅ Prisma Client conectado ao PostgreSQL e middleware multi-tenant ativado.");
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
