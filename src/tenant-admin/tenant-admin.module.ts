import { Module } from '@nestjs/common';
import { TenantAdminService } from './tenant-admin.service';
import { TenantAdminController } from './tenant-admin.controller';
import { PrismaModule } from '../database/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TenantAdminController],
  providers: [TenantAdminService],
  exports: [TenantAdminService],
})
export class TenantAdminModule {}
