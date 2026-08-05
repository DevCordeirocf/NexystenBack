import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { TenantContextService } from '../tenant/tenant-context.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaErrorHandler } from '../shared/prisma-error.handler';

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContextService: TenantContextService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const tenantId = this.tenantContextService.getRequiredTenantId();
    const { tenantId: _ignoredTenantId, ...data } = createCategoryDto;

    try {
      return await this.prisma.category.create({
        data: {
          ...data,
          tenantId,
        },
      });
    } catch (err) {
      PrismaErrorHandler.handle(err, { entity: 'Category' });
    }
  }

  async findAll() {
    const tenantId = this.tenantContextService.getRequiredTenantId();

    try {
      return await this.prisma.category.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (err) {
      PrismaErrorHandler.handle(err, { entity: 'Category' });
    }
  }

  async findOne(id: string) {
    const tenantId = this.tenantContextService.getRequiredTenantId();

    try {
      const category = await this.prisma.category.findFirst({
        where: {
          id,
          tenantId,
        },
      });

      if (!category) {
        throw new NotFoundException(`Categoria com ID "${id}" nao encontrada para este tenant.`);
      }

      return category;
    } catch (err) {
      PrismaErrorHandler.handle(err, { entity: 'Category' });
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const tenantId = this.tenantContextService.getRequiredTenantId();
    const { tenantId: _ignoredTenantId, ...data } = updateCategoryDto;

    await this.findOne(id);

    try {
      return await this.prisma.category.update({
        where: {
          id,
          tenantId,
        },
        data,
      });
    } catch (err) {
      PrismaErrorHandler.handle(err, { entity: 'Category' });
    }
  }

  async remove(id: string) {
    const tenantId = this.tenantContextService.getRequiredTenantId();

    await this.findOne(id);

    try {
      return await this.prisma.category.delete({
        where: {
          id,
          tenantId,
        },
      });
    } catch (err) {
      PrismaErrorHandler.handle(err, { entity: 'Category' });
    }
  }
}
