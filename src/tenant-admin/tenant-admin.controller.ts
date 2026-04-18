import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TenantAdminService } from './tenant-admin.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Administração Master')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MASTER_ADMIN)
@Controller('tenant-admin')
export class TenantAdminController {
  constructor(private readonly tenantAdminService: TenantAdminService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo tenant (loja)' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantAdminService.create(createTenantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os tenants cadastrados' })
  findAll() {
    return this.tenantAdminService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter um tenant específico pelo ID' })
  findOne(@Param('id') id: string) {
    return this.tenantAdminService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um tenant existente' })
  update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
    return this.tenantAdminService.update(id, updateTenantDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um tenant' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.tenantAdminService.remove(id);
  }
}
