import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { TenantContextService } from '../tenant/tenant-context.service';
import { CreateContactRequestDto } from './dto/create-contact-request.dto';
import { UpdateContactRequestDto } from './dto/update-contact-request.dto';

@Injectable()
export class ContactRequestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContextService: TenantContextService,
  ) {}

  /**
   * Cria uma nova solicitação de contato (Lead) vinculada a um produto e tenant.
   */
  async create(createContactRequestDto: CreateContactRequestDto) {
    const tenantId = this.tenantContextService.getRequiredTenantId();

    // Valida se o produto existe e pertence ao mesmo tenant da solicitação
    const product = await this.prisma.product.findFirst({
      where: {
        id: createContactRequestDto.productId,
        tenantId,
      },
    });

    if (!product) {
      throw new NotFoundException(
        `Produto com ID "${createContactRequestDto.productId}" não encontrado para este tenant.`,
      );
    }

    return this.prisma.contactRequest.create({
      data: {
        ...createContactRequestDto,
        tenantId,
      },
    });
  }

  /**
   * Lista todas as solicitações de contato do tenant atual.
   * Permite filtrar por status (PENDING, CONTACTED, CLOSED).
   */
  async findAll(status?: string) {
    const tenantId = this.tenantContextService.getRequiredTenantId();

    return this.prisma.contactRequest.findMany({
      where: { 
        tenantId,
        status: status ? status : undefined,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            images: true,
          }
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Busca os detalhes de uma solicitação de contato específica.
   */
  async findOne(id: string) {
    const tenantId = this.tenantContextService.getRequiredTenantId();

    const contactRequest = await this.prisma.contactRequest.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        product: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    if (!contactRequest) {
      throw new NotFoundException(
        `Solicitação de contato com ID "${id}" não encontrada para este tenant.`,
      );
    }

    return contactRequest;
  }

  /**
   * Atualiza o status ou notas internas de uma solicitação de contato.
   */
  async update(
    id: string,
    updateContactRequestDto: UpdateContactRequestDto,
  ) {
    const tenantId = this.tenantContextService.getRequiredTenantId();

    // Garante que a solicitação existe e pertence ao tenant antes de atualizar
    await this.findOne(id);

    return this.prisma.contactRequest.update({
      where: { id },
      data: updateContactRequestDto,
      include: {
        product: true,
      },
    });
  }

  /**
   * Remove uma solicitação de contato do sistema.
   */
  async remove(id: string) {
    const tenantId = this.tenantContextService.getRequiredTenantId();

    // Garante que a solicitação existe e pertence ao tenant antes de remover
    await this.findOne(id);

    return this.prisma.contactRequest.delete({
      where: { id },
    });
  }
}
