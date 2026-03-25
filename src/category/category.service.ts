import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { tenantId, ...data } = createCategoryDto;
    if (!tenantId) {
      throw new Error("Tenant ID is required to create a category.");
    }
    return this.prisma.category.create({
      data: {
        ...data,
        tenantId: tenantId as string,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.category.findMany({
      where: {
        tenantId: tenantId as string,
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
        tenantId: tenantId as string,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found for tenant "${tenantId}"`);
    }
    return category;
  }

  async update(id: string, tenantId: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
        tenantId: tenantId as string,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found for tenant "${tenantId}"`);
    }

    return this.prisma.category.update({
      where: {
        id,
        tenantId,
      },
      data: updateCategoryDto,
    });
  }

  async remove(id: string, tenantId: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
        tenantId: tenantId as string,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found for tenant "${tenantId}"`);
    }

    return this.prisma.category.delete({
      where: {
        id,
        tenantId: tenantId as string,
      },
    });
  }
}
