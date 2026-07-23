import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { TenantContextService } from '../tenant/tenant-context.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContextService: TenantContextService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const tenantId = this.tenantContextService.getRequiredTenantId();
    const { tenantId: _ignoredTenantId, ...data } = createCategoryDto;

    return this.prisma.category.create({
      data: {
        ...data,
        tenantId,
      },
    });
  }

  async findAll() {
    const tenantId = this.tenantContextService.getRequiredTenantId();

    return this.prisma.category.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const tenantId = this.tenantContextService.getRequiredTenantId();

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
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const tenantId = this.tenantContextService.getRequiredTenantId();
    const { tenantId: _ignoredTenantId, ...data } = updateCategoryDto;

    await this.findOne(id);

    return this.prisma.category.update({
      where: {
        id,
        tenantId,
      },
      data,
    });
  }

  async remove(id: string) {
    const tenantId = this.tenantContextService.getRequiredTenantId();

    await this.findOne(id);

    return this.prisma.category.delete({
      where: {
        id,
        tenantId,
      },
    });
  }
}
