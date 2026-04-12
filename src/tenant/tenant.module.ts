import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { TenantContextService } from './tenant-context.service';
import { TenantInterceptor } from './tenant.interceptor';

@Module({
  imports: [forwardRef(() => PrismaModule)],
  providers: [TenantContextService, TenantInterceptor],
  exports: [TenantContextService, TenantInterceptor], 
})
export class TenantModule {}
