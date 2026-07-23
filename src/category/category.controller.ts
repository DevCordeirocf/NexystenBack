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
import { ApiTags, ApiOperation, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { Public } from '../auth/public.decorator';

/**
 * Controller responsável pela gestão de categorias.
 * Todas as rotas são protegidas por autenticação JWT e verificação de roles.
 */
@ApiTags('Categorias')
@ApiHeader({ name: 'X-Tenant-ID', description: 'ID ou nome do tenant para rotas publicas. Rotas autenticadas usam o tenantId do JWT.', required: false })
@ApiBearerAuth()
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
  @ApiOperation({ summary: 'Criar uma nova categoria' })
  @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  /**
   * Lista todas as categorias do tenant atual.
   * Requer as roles MASTER_ADMIN, TENANT_ADMIN ou CUSTOMER.
   * @param tenantId ID do tenant extraído do header X-Tenant-ID.
   * @returns Uma lista de categorias.
   */
  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar todas as categorias do tenant' })
  findAll() {
    return this.categoryService.findAll();
  }

  /**
   * Obtém uma categoria específica pelo ID para o tenant atual.
   * Acesso PÚBLICO para a vitrine.
   * @param id ID da categoria.
   * @param tenantId ID do tenant extraído do header X-Tenant-ID.
   * @returns A categoria encontrada.
   */
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obter uma categoria específica pelo ID' })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
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
  @ApiOperation({ summary: 'Atualizar uma categoria existente' })
  @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN)
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  /**
   * Remove uma categoria pelo ID para o tenant atual.
   * Requer as roles MASTER_ADMIN ou TENANT_ADMIN.
   * @param id ID da categoria a ser removida.
   * @param tenantId ID do tenant extraído do header X-Tenant-ID.
   * @returns Resposta de sucesso (sem conteúdo).
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma categoria' })
  @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
