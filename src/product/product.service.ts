import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  InternalServerErrorException, 
  BadRequestException 
} from '@nestjs/common';
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

      if (categoryIds?.length) {
        await this.ensureCategoriesBelongToTenant(categoryIds, tenantId);
      }

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
    } catch (error: any) {
      this.handlePrismaError(error, 'Erro ao criar o produto.');
    }
  }

  /**
   * Lista todos os produtos do tenant atual, com opção de filtrar por categoria.
   * Se o usuário for CUSTOMER ou NÃO ESTIVER LOGADO (vitrine pública), 
   * filtra apenas produtos ativos e com estoque.
   */
  async findAll(categoryId?: string, userRole?: UserRole) {
    try {
      const tenantId = this.tenantContextService.getRequiredTenantId();

      const where: any = {
        tenantId,
        categories: categoryId ? {
          some: { id: categoryId }
        } : undefined,
      };

      // Se for cliente ou acesso público (sem role), aplica filtros de disponibilidade
      if (!userRole || userRole === UserRole.CUSTOMER) {
        where.isActive = true;
        where.stock = { gt: 0 };
      }

      return await this.prisma.product.findMany({
        where,
        include: {
          categories: true
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error: any) {
      this.handlePrismaError(error, 'Erro ao listar os produtos.');
    }
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
      throw new NotFoundException(`Produto com ID "${id}" não encontrado.`);
    }

    return product;
  }

  /**
   * Atualiza as informações de um produto existente do tenant atual.
   * Permite atualizar as categorias vinculadas.
   */
  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const tenantId = this.tenantContextService.getRequiredTenantId();
      const { categoryIds, ...productData } = updateProductDto;

      // Verifica se o produto existe e pertence ao tenant antes de atualizar
      await this.findOne(id);

      if (categoryIds?.length) {
        await this.ensureCategoriesBelongToTenant(categoryIds, tenantId);
      }

      return await this.prisma.product.update({
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
    } catch (error: any) {
      this.handlePrismaError(error, 'Erro ao atualizar o produto.');
    }
  }

  /**
   * Remove um produto do tenant atual pelo ID.
   */
  async remove(id: string) {
    const tenantId = this.tenantContextService.getRequiredTenantId();
    await this.findOne(id);

    try {
      return await this.prisma.product.delete({
        where: { id, tenantId },
      });
    } catch (error: any) {
      if (error.code === 'P2003') {
        throw new ConflictException(
          'Não é possível excluir este produto pois existem solicitações de contato (leads) ou histórico vinculados a ele. Recomendamos inativar o produto.'
        );
      }
      this.handlePrismaError(error, 'Erro ao excluir o produto.');
    }
  }

  /**
   * Atualiza o estoque e a disponibilidade de um produto existente do tenant atual.
   */
  async updateStockAndAvailability(id: string, stock?: number, isActive?: boolean) {
    try {
      const tenantId = this.tenantContextService.getRequiredTenantId();
      await this.findOne(id);

      const dataToUpdate: { stock?: number; isActive?: boolean } = {};
      if (stock !== undefined) {
        dataToUpdate.stock = stock;
      }
      if (isActive !== undefined) {
        dataToUpdate.isActive = isActive;
      }

      return await this.prisma.product.update({
        where: { id, tenantId },
        data: dataToUpdate,
        include: {
          categories: true
        }
      });
    } catch (error: any) {
      this.handlePrismaError(error, 'Erro ao atualizar a disponibilidade do produto.');
    }
  }

  /**
   * Método privado para centralizar o tratamento de erros nativos do Prisma.
   */
  private handlePrismaError(error: any, defaultMessage: string): never {
    if (error.status) {
      throw error;
    }

    switch (error.code) {
      case 'P2002':
        throw new ConflictException('Já existe um registro com estes dados únicos neste tenant.');
      case 'P2025':
        throw new NotFoundException('Registro não encontrado na base de dados.');
      case 'P2014':
        throw new BadRequestException('A alteração solicitada viola uma relação exigida pelo banco de dados.');
      default:
        console.error(`[ProductService Error]: ${error.message || error}`);
        throw new InternalServerErrorException(defaultMessage);
    }
  }

  private async ensureCategoriesBelongToTenant(categoryIds: string[], tenantId: string) {
    const uniqueCategoryIds = [...new Set(categoryIds)];

    const ownedCategoriesCount = await this.prisma.category.count({
      where: {
        id: { in: uniqueCategoryIds },
        tenantId,
      },
    });

    if (ownedCategoriesCount !== uniqueCategoryIds.length) {
      throw new BadRequestException('Uma ou mais categorias nao pertencem ao tenant atual.');
    }
  }
}
