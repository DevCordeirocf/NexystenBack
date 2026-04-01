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
    const { name, isActive, themeConfig, logoUrl, whatsappNumber, adminEmail, adminPassword } = createTenantDto;

    const existingTenant = await this.prisma.tenantStore.findUnique({ where: { name } });
    if (existingTenant) {
      throw new BadRequestException(`Já existe uma loja cadastrada com o nome '${name}'.`);
    }

    return this.prisma.$transaction(async (prisma) => {
      // Criação da loja
      const tenant = await prisma.tenantStore.create({
        data: {
          name,
          isActive,
          themeConfig,
          logoUrl,
          whatsapp: whatsappNumber,
        },
      });

      // Criação opcional do usuário administrador da loja
      if (adminEmail && adminPassword) {
        const existingAdminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
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
  async findAll() {
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

  /**
   * Atualiza as informações de uma loja existente
   */
  async update(id: string, updateTenantDto: UpdateTenantDto) {
    const { logoUrl, whatsappNumber, ...dataToUpdate } = updateTenantDto;
    
    // Garante que a loja existe antes de atualizar
    await this.findOne(id); 

    return this.prisma.tenantStore.update({
      where: { id },
      data: {
        ...dataToUpdate,
        logoUrl,
        whatsapp: whatsappNumber,
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
