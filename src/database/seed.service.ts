import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from './prisma.service';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    try {
      await this.bootstrapFirstMasterAdmin();
    } catch (error: any) {
      this.logger.warn(
        'Bootstrap do MASTER_ADMIN falhou: ' + (error?.message || String(error)),
      );

      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
    }
  }

  private async bootstrapFirstMasterAdmin() {
    const existingMasterCount = await this.prisma.user.count({
      where: { tenantId: null, role: UserRole.MASTER_ADMIN },
    });

    if (existingMasterCount > 0) {
      return;
    }

    const email = process.env.MASTER_ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.MASTER_ADMIN_PASSWORD;
    const name = process.env.MASTER_ADMIN_NAME?.trim() || 'Owner';

    if (!email || !password) {
      const message =
        'Nenhum MASTER_ADMIN encontrado. Defina MASTER_ADMIN_EMAIL e MASTER_ADMIN_PASSWORD para criar o primeiro acesso.';

      if (process.env.NODE_ENV === 'production') {
        throw new Error(message);
      }

      this.logger.warn(message);
      return;
    }

    if (process.env.NODE_ENV === 'production' && password.length < 12) {
      throw new Error('MASTER_ADMIN_PASSWORD deve ter pelo menos 12 caracteres em producao.');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: UserRole.MASTER_ADMIN,
      },
    });

    this.logger.log(`Primeiro MASTER_ADMIN criado: ${email}`);
  }
}
