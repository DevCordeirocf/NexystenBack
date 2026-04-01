import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TenantContextService } from '../tenant/tenant-context.service';

/**
 * Serviço responsável pela conexão com o banco de dados via Prisma.
 * Implementa o isolamento multi-tenant através de middlewares.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly tenantContextService: TenantContextService) {
    super({
      log: ['error', 'warn'], // Logs de erro e avisos habilitados
    });
  }

  async onModuleInit() {
    await this.$connect();

    // Middleware para isolamento automático de dados por Tenant
    this.$use(async (params, next) => {
      const tenantId = this.tenantContextService.getTenantId();

      if (tenantId) {
        // Modelos que requerem isolamento por Tenant
        const modelsToIsolate = ["Product", "ContactRequest", "Category"];

        if (params.model && modelsToIsolate.includes(params.model)) {
          // Injeta o tenantId automaticamente em todas as operações de leitura e escrita
          if (["findUnique", "findFirst", "findMany", "count", "update", "updateMany", "delete", "deleteMany"].includes(params.action)) {
            params.args.where = { ...params.args.where, tenantId };
          } else if (params.action === "create") {
            params.args.data = { ...params.args.data, tenantId };
          }
        }
      }
      return next(params);
    });

    console.log("✅ Banco de Dados conectado e isolamento Multi-tenant ativado.");
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
