import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { TenantId } from '../shared/decorators/tenant-id.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCategoryDto: CreateCategoryDto, @TenantId() tenantId: string) {
    createCategoryDto.tenantId = tenantId;
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN, UserRole.CUSTOMER)
  findAll(@TenantId() tenantId: string) {
    return this.categoryService.findAll(tenantId);
  }

  @Get(':id')
  @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN, UserRole.CUSTOMER)
  findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.categoryService.findOne(id, tenantId);
  }

  @Patch(':id')
  @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN)
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @TenantId() tenantId: string) {
    return this.categoryService.update(id, tenantId, updateCategoryDto);
  }

  @Delete(':id')
  @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.categoryService.remove(id, tenantId);
  }
}
