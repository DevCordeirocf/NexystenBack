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
   * Criar uma nova solicitação de contato
   */
  async create(createContactRequestDto: CreateContactRequestDto) {
    const tenantId = this.tenantContextService.getRequiredTenantId();

    // Verificar se o produto existe e pertence ao tenant
    const product = await this.prisma.product.findFirst({
      where: {
        id: createContactRequestDto.productId,
        tenantId,
      },
    });

    if (!product) {
      throw new NotFoundException(
        `Produto com ID ${createContactRequestDto.productId} não encontrado.`,
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
   * Listar todas as solicitações de contato do tenant
   */
  async findAll() {
    const tenantId = this.tenantContextService.getRequiredTenantId();

    return this.prisma.contactRequest.findMany({
      where: { tenantId },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Obter uma solicitação de contato específica
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
      },
    });

    if (!contactRequest) {
      throw new NotFoundException(
        `Solicitação de contato com ID ${id} não encontrada.`,
      );
    }

    return contactRequest;
  }

  /**
   * Atualizar uma solicitação de contato
   */
  async update(
    id: string,
    updateContactRequestDto: UpdateContactRequestDto,
  ) {
    const tenantId = this.tenantContextService.getRequiredTenantId();

    // Verificar se a solicitação existe e pertence ao tenant
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
   * Deletar uma solicitação de contato
   */
  async remove(id: string) {
    const tenantId = this.tenantContextService.getRequiredTenantId();

    // Verificar se a solicitação existe e pertence ao tenant
    await this.findOne(id);

    return this.prisma.contactRequest.delete({
      where: { id },
    });
  }
}
