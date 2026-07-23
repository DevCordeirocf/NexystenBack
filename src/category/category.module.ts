import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaModule } from '../database/prisma.module';
import { TenantModule } from '../tenant/tenant.module';

@Module({
  imports: [PrismaModule, TenantModule],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService], // Export CategoryService if it needs to be used by other modules
})
export class CategoryModule {}
