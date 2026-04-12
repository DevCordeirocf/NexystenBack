import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Controller('tenants/public')
export class TenantPublicController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':name')
  async findByName(@Param('name') name: string) {
    const tenant = await this.prisma.tenantStore.findUnique({
      where: { name },
      select: {
        id: true,
        name: true,
        logoUrl: true,
        themeConfig: true,
        whatsapp: true,
        isActive: true,
      },
    });

    if (!tenant || !tenant.isActive) {
      throw new NotFoundException(`Loja '${name}' não encontrada ou inativa.`);
    }

    return tenant;
  }
}
