import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';

@Injectable()
export class TenantAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTenantDto: CreateTenantDto) {
    const { name, isActive, themeConfig, adminEmail, adminPassword } = createTenantDto;

    const existingTenant = await this.prisma.tenantStore.findUnique({ where: { name } });
    if (existingTenant) {
      throw new BadRequestException(`Tenant with name '${name}' already exists.`);
    }

    return this.prisma.$transaction(async (prisma) => {
      const tenant = await prisma.tenantStore.create({
        data: {
          name,
          isActive,
          themeConfig,
        },
      });

      if (adminEmail && adminPassword) {
        const existingAdminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
        if (existingAdminUser) {
          throw new BadRequestException(`User with email '${adminEmail}' already exists.`);
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

  async findAll() {
    return this.prisma.tenantStore.findMany({
      include: { admins: { select: { id: true, email: true } } },
    });
  }

  async findOne(id: string) {
    const tenant = await this.prisma.tenantStore.findUnique({
      where: { id },
      include: { admins: { select: { id: true, email: true } } },
    });
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found.`);
    }
    return tenant;
  }

  async update(id: string, updateTenantDto: UpdateTenantDto) {
    await this.findOne(id); // Check if tenant exists
    return this.prisma.tenantStore.update({
      where: { id },
      data: updateTenantDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if tenant exists
    return this.prisma.tenantStore.delete({ where: { id } });
  }
}
