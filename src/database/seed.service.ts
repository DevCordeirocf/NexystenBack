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
      await this.seedMasterAdmins();
    } catch (error: any) {
      this.logger.warn(
        'Seed falhou (pode ser esperado em ambiente sem banco de dados): ' +
          (error?.message || String(error)),
      );
    }
  }

  private async seedMasterAdmins() {
    const masters = [
      {
        email: 'admin@nexysten.com',
        name: 'Admin Master',
        password: 'admin123',
      },
      {
        email: 'suporte@nexysten.com',
        name: 'Suporte Nexysten',
        password: 'admin123',
      },
    ];

    for (const master of masters) {
      const exists = await this.prisma.user.findUnique({
        where: { email: master.email },
      });

      if (!exists) {
        const hashedPassword = await bcrypt.hash(master.password, 10);
        await this.prisma.user.create({
          data: {
            email: master.email,
            name: master.name,
            password: hashedPassword,
            role: UserRole.MASTER_ADMIN,
          },
        });
        this.logger.log(`Usuário MASTER_ADMIN criado: ${master.email}`);
      }
    }
  }
}
