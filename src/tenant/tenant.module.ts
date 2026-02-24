import { Module } from '@nestjs/common';
import { TenantContextService } from './tenant-context.service';

@Module({
  providers: [TenantContextService],
  // Exportamos o serviço para que ele possa ser injetado em qualquer outro módulo,
  // como o PrismaService (para o middleware) e em Interceptors/Guards.
  exports: [TenantContextService], 
})
export class TenantModule {}