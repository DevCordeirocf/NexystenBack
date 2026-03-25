import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { TenantContextService } from '../tenant/tenant-context.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContextService: TenantContextService,
  ) {}

  /**
   * Criar um novo produto
   */
  async create(createProductDto: CreateProductDto) {
    const tenantId = this.tenantContextService.getRequiredTenantId();
    const { categoryIds, ...productData } = createProductDto;

    return this.prisma.product.create({
      data: {
        ...productData,
        tenantId,
        categories: categoryIds ? {
          connect: categoryIds.map(id => ({ id }))
        } : undefined,
      },
      include: {
        categories: true
      }
    });
  }

  /**
   * Listar todos os produtos do tenant
   */
  async findAll() {
    const tenantId = this.tenantContextService.getRequiredTenantId();

    return this.prisma.product.findMany({
      where: { tenantId },
      include: {
        categories: true
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Obter um produto específico
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
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }

    return product;
  }

  /**
   * Atualizar um produto
   */
  async update(id: string, updateProductDto: UpdateProductDto) {
    const tenantId = this.tenantContextService.getRequiredTenantId();
    const { categoryIds, ...productData } = updateProductDto;

    // Verificar se o produto existe e pertence ao tenant
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
   * Deletar um produto
   */
  async remove(id: string) {
    const tenantId = this.tenantContextService.getRequiredTenantId();

    // Verificar se o produto existe e pertence ao tenant
    await this.findOne(id);

    return this.prisma.product.delete({
      where: { id, tenantId },
    });
  }
}
