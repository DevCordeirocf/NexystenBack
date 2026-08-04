import { IsEmail } from 'class-validator';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';

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
  }

  /**
   * Lista todas as lojas cadastradas no sistema
   */
  async findAllTenants() {
    return this.prisma.tenantStore.findMany({
      include: { users: { select: { id: true, email: true } } },
    });
  }

  /**
   * Busca os detalhes de uma loja específica pelo ID
   */
  async findOne(id: string) {
    const tenant = await this.prisma.tenantStore.findUnique({
      where: { id },
      include: { users: { select: { id: true, email: true } } },
    });
    if (!tenant) {
      throw new NotFoundException(`Loja com ID "${id}" não encontrada.`);
    }
    return tenant;
  }

  async findAllUsersByTenant(id: string) {
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
  }

  /**
   * Atualiza as informações de uma loja existente
   */
  async update(id: string, updateTenantDto: UpdateTenantDto) {
    const { logoUrl, whatsapp, ...dataToUpdate } = updateTenantDto;
    
    // Garante que a loja existe antes de atualizar
    await this.findOne(id); 

    return this.prisma.tenantStore.update({
      where: { id },
      data: {
        ...dataToUpdate,
        logoUrl,
        whatsapp,
      },
    });
  }

  /**
   * Remove uma loja do sistema
   */
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.tenantStore.delete({ where: { id } });
  }
}
