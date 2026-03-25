// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TenantInterceptor } from './tenant/tenant.interceptor';
import { PrismaModule } from './database/prisma.module';
import { TenantModule } from './tenant/tenant.module';
import { ProductModule } from './product/product.module';
import { ContactRequestModule } from './contact-request/contact-request.module';
import { AuthModule } from './auth/auth.module';
import { TenantAdminModule } from './tenant-admin/tenant-admin.module'; 

@Module({
  imports: [
    TenantModule,
    PrismaModule,
    ProductModule,
    ContactRequestModule,
    AuthModule,
    TenantAdminModule,
  ],
  controllers: [AppController], 
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantInterceptor,
    },
  ], 
})
export class AppModule {}