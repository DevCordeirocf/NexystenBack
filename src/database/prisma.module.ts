import { Module } from '@nestjs/common';
import { TenantModule } from '../tenant/tenant.module';
import { PrismaService } from './prisma.service';
import { SeedService } from './seed.service';

@Module({
  imports: [TenantModule],
  providers: [PrismaService, SeedService],
  exports: [PrismaService],
})
export class PrismaModule {}
