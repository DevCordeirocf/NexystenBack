// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './database/prisma.module';
import { TenantModule } from './tenant/tenant.module';
import { ProductModule } from './product/product.module';
import { ContactRequestModule } from './contact-request/contact-request.module'; 

@Module({
  imports: [
    TenantModule,
    PrismaModule,
    ProductModule,
    ContactRequestModule,
  ],
  controllers: [AppController], 
  providers: [AppService], 
})
export class AppModule {}