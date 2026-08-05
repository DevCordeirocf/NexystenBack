import { IsEmail } from 'class-validator';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';
import { PrismaErrorHandler } from '../shared/prisma-error.handler';

@Injectable()
export class TenantAdminService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria uma nova loja (Tenant) e opcionalmente um usuário administrador
   */
  async create(createTenantDto: CreateTenantDto) {
    const { name, isActive, themeConfig, logoUrl, whatsapp, adminEmail, adminPassword } = createTenantDto;

    const existingTenant = await this.prisma.tenantStore.findUnique({ where: { name } });
    if (existingTenant) {
      throw new BadRequestException(`Já existe uma loja cadastrada com o nome '${name}'.`);
    }

    return this.prisma.$transaction(async (prisma: any) => {
      // Criação da loja
      const tenant = await prisma.tenantStore.create({
        data: {
          name,
          isActive,
          themeConfig,
          logoUrl,
          whatsapp,
        },
      });

      // Criação opcional do usuário administrador da loja
      if (adminEmail && adminPassword) {
        const existingAdminUser = await prisma.user.findFirst({
          where: { email: adminEmail, tenantId: tenant.id },
        });
        if (existingAdminUser) {
          throw new BadRequestException(`Já existe um usuário cadastrado com o e-mail '${adminEmail}'.`);
        }

      return await this.prisma.$transaction(async (prisma) => {
        // Criação da loja
        const tenant = await prisma.tenantStore.create({
          data: {
            name,
            isActive,
            themeConfig,
            logoUrl,
            whatsapp,
          },
        });

        // Criação opcional do usuário administrador da loja
        if (adminEmail && adminPassword) {
          const existingAdminUser = await prisma.user.findFirst({
            where: { email: adminEmail, tenantId: tenant.id },
          });
          if (existingAdminUser) {
            throw new BadRequestException(`Já existe um usuário cadastrado com o e-mail '${adminEmail}'.`);
          }

          const hashedPassword = await bcrypt.hash(adminPassword, 10);
          await prisma.user.create({
            data: {
              email: adminEmail,
              password: hashedPassword,
              role: UserRole.TENANT_ADMIN,
              tenantId: tenant.id,
            },
          });
        }
        return tenant;
      });
    } catch (err) {
      PrismaErrorHandler.handle(err, { entity: 'Tenant' });
    }
  }

  /**
   * Lista todas as lojas cadastradas no sistema
   */
  async findAllTenants() {
    try {
      return await this.prisma.tenantStore.findMany({
        include: { users: { select: { id: true, email: true } } },
      });
    } catch (err) {
      PrismaErrorHandler.handle(err, { entity: 'Tenant' });
    }
  }

  /**
   * Busca os detalhes de uma loja específica pelo ID
   */
  async findOne(id: string) {
    try {
      const tenant = await this.prisma.tenantStore.findUnique({
        where: { id },
        include: { users: { select: { id: true, email: true } } },
      });
      if (!tenant) {
        throw new NotFoundException(`Loja com ID "${id}" não encontrada.`);
      }
      return tenant;
    } catch (err) {
      PrismaErrorHandler.handle(err, { entity: 'Tenant' });
    }
  }

  async findAllUsersByTenant(id: string) {
    try {
      return await this.prisma.user.findMany({
        where: { tenantId: id },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (err) {
      PrismaErrorHandler.handle(err, { entity: 'User' });
    }
  }

  /**
   * Atualiza as informações de uma loja existente
   */
  async update(id: string, updateTenantDto: UpdateTenantDto) {
    const { logoUrl, whatsapp, ...dataToUpdate } = updateTenantDto;
    
    // Garante que a loja existe antes de atualizar
    await this.findOne(id); 

    try {
      return await this.prisma.tenantStore.update({
        where: { id },
        data: {
          ...dataToUpdate,
          logoUrl,
          whatsapp,
        },
      });
    } catch (err) {
      PrismaErrorHandler.handle(err, { entity: 'Tenant' });
    }
  }

  /**
   * Remove uma loja do sistema
   */
  async remove(id: string) {
    try {
      await this.findOne(id);
      return await this.prisma.tenantStore.delete({ where: { id } });
    } catch (err) {
      PrismaErrorHandler.handle(err, { entity: 'Tenant' });
    }
  }
}
