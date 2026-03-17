// src/app.service.ts
import { Injectable } from '@nestjs/common';
import { TenantContextService } from './tenant/tenant-context.service';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Bem-vindo ao NEXYSTEN MVP - Sistema SaaS Multi-tenant para Joias';
  }
}