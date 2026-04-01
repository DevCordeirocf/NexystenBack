import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { TenantId } from '../shared/decorators/tenant-id.decorator';

/**
 * Controller responsável pela gestão de categorias.
 * Todas as rotas são protegidas por autenticação JWT e verificação de roles.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * Cria uma nova categoria para o tenant atual.
   * Requer as roles MASTER_ADMIN ou TENANT_ADMIN.
   * @param createCategoryDto Dados para criação da categoria.
   * @param tenantId ID do tenant extraído do header X-Tenant-ID.
   * @returns A categoria criada.
   */
  @Post()
  @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCategoryDto: CreateCategoryDto, @TenantId() tenantId: string) {
    createCategoryDto.tenantId = tenantId;
    return this.categoryService.create(createCategoryDto);
  }

  /**
   * Lista todas as categorias do tenant atual.
   * Requer as roles MASTER_ADMIN, TENANT_ADMIN ou CUSTOMER.
   * @param tenantId ID do tenant extraído do header X-Tenant-ID.
   * @returns Uma lista de categorias.
   */
  @Get()
  @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN, UserRole.CUSTOMER)
  findAll(@TenantId() tenantId: string) {
    return this.categoryService.findAll(tenantId);
  }

  /**
   * Obtém uma categoria específica pelo ID para o tenant atual.
   * Requer as roles MASTER_ADMIN, TENANT_ADMIN ou CUSTOMER.
   * @param id ID da categoria.
   * @param tenantId ID do tenant extraído do header X-Tenant-ID.
   * @returns A categoria encontrada.
   */
  @Get(':id')
  @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN, UserRole.CUSTOMER)
  findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.categoryService.findOne(id, tenantId);
  }

  /**
   * Atualiza uma categoria existente pelo ID para o tenant atual.
   * Requer as roles MASTER_ADMIN ou TENANT_ADMIN.
   * @param id ID da categoria a ser atualizada.
   * @param updateCategoryDto Dados para atualização da categoria.
   * @param tenantId ID do tenant extraído do header X-Tenant-ID.
   * @returns A categoria atualizada.
   */
  @Patch(':id')
  @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN)
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @TenantId() tenantId: string) {
    return this.categoryService.update(id, tenantId, updateCategoryDto);
  }

  /**
   * Remove uma categoria pelo ID para o tenant atual.
   * Requer as roles MASTER_ADMIN ou TENANT_ADMIN.
   * @param id ID da categoria a ser removida.
   * @param tenantId ID do tenant extraído do header X-Tenant-ID.
   * @returns Resposta de sucesso (sem conteúdo).
   */
  @Delete(':id')
  @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.categoryService.remove(id, tenantId);
  }
}
