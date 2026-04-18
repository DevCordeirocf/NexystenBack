import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../database/prisma.service';

@ApiTags('Tenants Públicos')
@Controller('tenants/public')
export class TenantPublicController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':name')
  @ApiOperation({ summary: 'Obter configurações públicas de um tenant pelo nome (subdomínio)' })
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
