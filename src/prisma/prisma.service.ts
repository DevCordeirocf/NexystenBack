import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import * as PrismaClientPkg from '@prisma/client';
const { PrismaClient } = (PrismaClientPkg as any);
import '../config/load-env';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL nao foi definida no ambiente.');
    }

    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });

    super({
      adapter,
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await super.$connect();
    console.log('✅ Prisma Client conectado ao PostgreSQL.');
  }

  async onModuleDestroy() {
    await super.$disconnect();
  }
}
