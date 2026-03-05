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
    console.log('✅ Prisma Client conectado ao PostgreSQL.');

    // Middleware para adicionar tenantId automaticamente em queries
    this.$use(async (params, next) => {
      // Modelos que requerem isolamento de tenant
      const tenantIsolatedModels = ['Product', 'ContactRequest'];

      if (tenantIsolatedModels.includes(params.model)) {
        const tenantId = this.tenantContextService.getTenantId();

        // Para operações de leitura (findUnique, findMany, etc)
        if (['findUnique', 'findMany', 'findFirst', 'count'].includes(params.action)) {
          if (params.args.where) {
            params.args.where.tenantId = tenantId;
          } else {
            params.args.where = { tenantId };
          }
        }

        // Para operações de atualização (update, updateMany)
        if (['update', 'updateMany'].includes(params.action)) {
          if (params.args.where) {
            params.args.where.tenantId = tenantId;
          }
        }

        // Para operações de exclusão (delete, deleteMany)
        if (['delete', 'deleteMany'].includes(params.action)) {
          if (params.args.where) {
            params.args.where.tenantId = tenantId;
          }
        }
      }

      return next(params);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
