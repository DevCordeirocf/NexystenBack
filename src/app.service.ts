// src/app.service.ts
import { Injectable } from '@nestjs/common';
import { TenantContextService } from './tenant/tenant-context.service';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('TenantContextService injetado com sucesso!');
    return 'Bem-vindo ao NEXYSTEN SaaS Backend (Fase 1: Fundação)';
  }
}