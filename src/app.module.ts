// src/app.module.ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
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
import { CategoryModule } from './category/category.module';
import { UploadModule } from './upload/upload.module'; 
import { RateLimitMiddleware } from './shared/middleware/rate-limit.middleware';
import { RequestContextMiddleware } from './shared/middleware/request-context.middleware';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
        // Use pino-pretty in non-production for readable logs
        transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty', options: { colorize: true } } : undefined,
      },
    }),
    PrismaModule, // Primeiro o banco
    TenantModule, // Depois o contexto do tenant
    AuthModule,
    ProductModule,
    ContactRequestModule,
    TenantAdminModule,
    CategoryModule,
    UploadModule,
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Aplica RequestId primeiro para que middlewares posteriores (rate-limit, etc.) possam usar requestId
    consumer.apply(RequestContextMiddleware, RateLimitMiddleware).forRoutes('*');
  }
}
