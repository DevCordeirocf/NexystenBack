import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { TenantContextService } from '../tenant/tenant-context.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContextService: TenantContextService,
  ) {}

  /**
   * Cria um novo produto para o tenant atual.
   * Vincula o produto às categorias fornecidas.
   */
  async create(createProductDto: CreateProductDto) {
    try {
      const tenantId = this.tenantContextService.getRequiredTenantId();
      const { categoryIds, stock, isActive, ...productData } = createProductDto;

      return await this.prisma.product.create({
        data: {
          ...productData,
          stock: stock !== undefined ? stock : 1,
          isActive: isActive !== undefined ? isActive : true,
          tenantId,
          categories: categoryIds ? {
            connect: categoryIds.map(id => ({ id }))
          } : undefined,
        },
        include: {
          categories: true
        }
      });
    } catch (error) {
      // Re-lança o erro para ser tratado pelo Global Exception Filter
      throw error;
    }
  }

  /**
   * Lista todos os produtos do tenant atual, com opção de filtrar por categoria.
   * Se o usuário for CUSTOMER, filtra apenas produtos ativos e com estoque.
   */
  async findAll(categoryId?: string, userRole?: UserRole) {
    const tenantId = this.tenantContextService.getRequiredTenantId();

    const where: any = {
      tenantId,
      categories: categoryId ? {
        some: { id: categoryId }
      } : undefined,
    };

    // Se for cliente, aplica filtros de disponibilidade
    if (userRole === UserRole.CUSTOMER) {
      where.isActive = true;
      where.stock = { gt: 0 };
    }

    return this.prisma.product.findMany({
      where,
      include: {
        categories: true
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Obtém um produto específico do tenant atual pelo ID.
   */
  async findOne(id: string) {
    const tenantId = this.tenantContextService.getRequiredTenantId();

    const product = await this.prisma.product.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        categories: true
      }
    });

    if (!product) {
      throw new NotFoundException(`Produto com ID "${id}" não encontrado para este tenant.`);
    }

    return product;
  }

  /**
   * Atualiza as informações de um produto existente do tenant atual.
   * Permite atualizar as categorias vinculadas.
   */
  async update(id: string, updateProductDto: UpdateProductDto) {
    const tenantId = this.tenantContextService.getRequiredTenantId();
    const { categoryIds, ...productData } = updateProductDto;

    // Verifica se o produto existe e pertence ao tenant antes de atualizar
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id, tenantId },
      data: {
        ...productData,
        categories: categoryIds ? {
          set: categoryIds.map(id => ({ id }))
        } : undefined,
      },
      include: {
        categories: true
      }
    });
  }

  /**
   * Remove um produto do tenant atual pelo ID.
   */
  async remove(id: string) {
    const tenantId = this.tenantContextService.getRequiredTenantId();

    // Verifica se o produto existe e pertence ao tenant antes de remover
    await this.findOne(id);

    return this.prisma.product.delete({
      where: { id, tenantId },
    });
  }

  /**
   * Atualiza o estoque e a disponibilidade de um produto existente do tenant atual.
   */
  async updateStockAndAvailability(id: string, stock?: number, isActive?: boolean) {
    const tenantId = this.tenantContextService.getRequiredTenantId();

    // Verifica se o produto existe e pertence ao tenant antes de atualizar
    await this.findOne(id);

    const dataToUpdate: { stock?: number; isActive?: boolean } = {};
    if (stock !== undefined) {
      dataToUpdate.stock = stock;
    }
    if (isActive !== undefined) {
      dataToUpdate.isActive = isActive;
    }

    return this.prisma.product.update({
      where: { id, tenantId },
      data: dataToUpdate,
      include: {
        categories: true
      }
    });
  }
}
