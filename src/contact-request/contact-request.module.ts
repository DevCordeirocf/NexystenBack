import { Module } from '@nestjs/common';
import { ContactRequestService } from './contact-request.service';
import { ContactRequestController } from './contact-request.controller';
import { PrismaModule } from '../database/prisma.module';
import { TenantModule } from '../tenant/tenant.module';

@Module({
  imports: [PrismaModule, TenantModule],
  controllers: [ContactRequestController],
  providers: [ContactRequestService],
})
export class ContactRequestModule {}
