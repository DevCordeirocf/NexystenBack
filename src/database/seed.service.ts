import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedMasterAdmins();
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
