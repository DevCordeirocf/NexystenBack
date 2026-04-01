import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria uma nova categoria para um tenant específico.
   * @param createCategoryDto Dados para criação da categoria.
   * @returns A categoria criada.
   */
  async create(createCategoryDto: CreateCategoryDto) {
    const { tenantId, ...data } = createCategoryDto;
    if (!tenantId) {
      throw new BadRequestException("O ID do Tenant é obrigatório para criar uma categoria.");
    }
    return this.prisma.category.create({
      data: {
        ...data,
        tenantId: tenantId as string,
      },
    });
  }

  /**
   * Lista todas as categorias de um tenant específico.
   * @param tenantId ID do tenant.
   * @returns Uma lista de categorias.
   */
  async findAll(tenantId: string) {
    return this.prisma.category.findMany({
      where: {
        tenantId: tenantId as string,
      },
    });
  }

  /**
   * Busca uma categoria específica pelo ID e tenantId.
   * @param id ID da categoria.
   * @param tenantId ID do tenant.
   * @returns A categoria encontrada.
   * @throws NotFoundException Se a categoria não for encontrada para o tenant.
   */
  async findOne(id: string, tenantId: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
        tenantId: tenantId as string,
      },
    });

    if (!category) {
      throw new NotFoundException(`Categoria com ID "${id}" não encontrada para este tenant.`);
    }
    return category;
  }

  /**
   * Atualiza uma categoria existente para um tenant específico.
   * @param id ID da categoria a ser atualizada.
   * @param tenantId ID do tenant.
   * @param updateCategoryDto Dados para atualização da categoria.
   * @returns A categoria atualizada.
   * @throws NotFoundException Se a categoria não for encontrada para o tenant.
   */
  async update(id: string, tenantId: string, updateCategoryDto: UpdateCategoryDto) {
    // Verifica se a categoria existe e pertence ao tenant antes de atualizar
    await this.findOne(id, tenantId);

    return this.prisma.category.update({
      where: {
        id,
        tenantId,
      },
      data: updateCategoryDto,
    });
  }

  /**
   * Remove uma categoria de um tenant específico.
   * @param id ID da categoria a ser removida.
   * @param tenantId ID do tenant.
   * @returns A categoria removida.
   * @throws NotFoundException Se a categoria não for encontrada para o tenant.
   */
  async remove(id: string, tenantId: string) {
    // Verifica se a categoria existe e pertence ao tenant antes de remover
    await this.findOne(id, tenantId);

    return this.prisma.category.delete({
      where: {
        id,
        tenantId: tenantId as string,
      },
    });
  }
}
