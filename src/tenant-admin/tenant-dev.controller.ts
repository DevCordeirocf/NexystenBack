import { Controller, Get, Post, Param, HttpCode, HttpStatus, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../database/prisma.service';
import { Public } from '../auth/public.decorator';

/**
 * Controller exclusivo para auxiliar o desenvolvimento do Front-end.
 * Fornece ferramentas de seed e reset para facilitar testes.
 */
@ApiTags('Desenvolvimento')
@Public()
@Controller('dev/tenants')
export class TenantDevController {
  constructor(private readonly prisma: PrismaService) {}

  private ensureDevelopmentEnvironment() {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException('Rotas de desenvolvimento desabilitadas em producao.');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os IDs e nomes de tenants (Público)' })
  async findAllIds() {
    this.ensureDevelopmentEnvironment();
    return this.prisma.tenantStore.findMany({
      select: {
        id: true,
        name: true,
        isActive: true,
      },
    });
  }

  @Post('reset/:tenantId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Limpar todos os dados de um tenant (Produtos, Categorias, Leads)' })
  async resetTenant(@Param('tenantId') tenantId: string) {
    this.ensureDevelopmentEnvironment();
    const tenant = await this.prisma.tenantStore.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant não encontrado');

    await this.prisma.$transaction([
      this.prisma.contactRequest.deleteMany({ where: { tenantId } }),
      this.prisma.product.deleteMany({ where: { tenantId } }),
      this.prisma.category.deleteMany({ where: { tenantId } }),
    ]);

    return { message: `Dados do tenant ${tenant.name} foram resetados com sucesso.` };
  }

  @Post('seed/:tenantId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Popular tenant com dados de teste (Joias)' })
  async seedTenant(@Param('tenantId') tenantId: string) {
    this.ensureDevelopmentEnvironment();
    const tenant = await this.prisma.tenantStore.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant não encontrado');

    const uniqueSuffix = Date.now().toString().slice(-4);

    return this.prisma.$transaction(async (tx: any) => {
      // 1. Criar Categorias
      const catAneis = await tx.category.create({
        data: { name: `Anéis ${uniqueSuffix}`, description: 'Anéis de ouro e prata', tenantId }
      });
      const catColares = await tx.category.create({
        data: { name: `Colares ${uniqueSuffix}`, description: 'Colares e gargantilhas', tenantId }
      });

      // 2. Criar Produtos
      const p1 = await tx.product.create({
        data: {
          name: `Anel Solitário Diamante ${uniqueSuffix}`,
          description: 'Anel clássico em ouro 18k com diamante de 15 pontos.',
          price: 2500.00,
          stock: 5,
          images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500'],
          tenantId,
          categories: { connect: { id: catAneis.id } }
        }
      });

      const p2 = await tx.product.create({
        data: {
          name: `Colar de Pérolas ${uniqueSuffix}`,
          description: 'Colar elegante com pérolas naturais e fecho em prata.',
          price: 850.00,
          stock: 10,
          images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500'],
          tenantId,
          categories: { connect: { id: catColares.id } }
        }
      });

      // 3. Criar Leads (Contact Requests)
      await tx.contactRequest.create({
        data: {
          tenantId,
          productId: p1.id,
          customerName: `João Silva (Teste ${uniqueSuffix})`,
          customerEmail: `joao.teste.${uniqueSuffix}@email.com`,
          customerPhone: '11999999999',
          message: 'Tenho interesse neste anel, qual o prazo de entrega?',
          status: 'PENDING'
        }
      });

      return { 
        message: `Seed finalizado para ${tenant.name}`,
        data: {
          categories: 2,
          products: 2,
          leads: 1,
          loteGerado: uniqueSuffix
        }
      };
    });
  }

  @Get('all-users')
  @ApiOperation({ summary: 'Listar todos os usuários do sistema (Debug)' })
  async findAllUsers() {
    this.ensureDevelopmentEnvironment();
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        tenantId: true,
        createdAt: true,
      },
    });
  }

  @Get('all-products')
  @ApiOperation({ summary: 'Listar todos os produtos de todos os tenants (Debug)' })
  async findAllProducts() {
    this.ensureDevelopmentEnvironment();
    return this.prisma.product.findMany({
      include: {
        tenant: { select: { name: true } },
        categories: { select: { name: true } },
      },
    });
  }

  @Get('all-categories')
  @ApiOperation({ summary: 'Listar todas as categorias de todos os tenants (Debug)' })
  async findAllCategories() {
    this.ensureDevelopmentEnvironment();
    return this.prisma.category.findMany({
      include: {
        tenant: { select: { name: true } },
      },
    });
  }

  @Get('all-leads')
  @ApiOperation({ summary: 'Listar todas as solicitações de contato de todos os tenants (Debug)' })
  async findAllLeads() {
    this.ensureDevelopmentEnvironment();
    return this.prisma.contactRequest.findMany({
      include: {
        tenant: { select: { name: true } },
        product: { select: { name: true } },
      },
    });
  }
}
