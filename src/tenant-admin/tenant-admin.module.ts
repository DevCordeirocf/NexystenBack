import { Module } from '@nestjs/common';
import { TenantAdminService } from './tenant-admin.service';
import { TenantAdminController } from './tenant-admin.controller';
import { TenantPublicController } from './tenant-public.controller';
import { TenantDevController } from './tenant-dev.controller';
import { PrismaModule } from '../database/prisma.module';
import { AuthModule } from '../auth/auth.module';
import '../config/load-env';

const devEnabled = process.env.ENABLE_DEV_ROUTES === 'true';
const devControllers = devEnabled ? [TenantDevController] : [];

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TenantAdminController, TenantPublicController, ...devControllers],
  providers: [TenantAdminService],
  exports: [TenantAdminService],
})
export class TenantAdminModule {}
