import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../database/prisma.service';
import { Public } from '../auth/public.decorator';

/**
 * Controller exclusivo para auxiliar o desenvolvimento do Front-end.
 * Fornece dados básicos de tenants sem necessidade de autenticação ou Tenant-ID.
 */
@ApiTags('Desenvolvimento (Facilitado)')
@Public()
@Controller('dev/tenants')
export class TenantDevController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os IDs e nomes de tenants (Público)' })
  async findAllIds() {
    return this.prisma.tenantStore.findMany({
      select: {
        id: true,
        name: true,
        isActive: true,
      },
    });
  }
}
