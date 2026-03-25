import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ContactRequestService } from './contact-request.service';
import { CreateContactRequestDto } from './dto/create-contact-request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { UpdateContactRequestDto } from './dto/update-contact-request.dto';

// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('contact-requests')
export class ContactRequestController {
  constructor(private readonly contactRequestService: ContactRequestService) {}

  /**
   * POST /contact-requests
   * Criar uma nova solicitação de contato
   */
  @Post()
  // @Roles(UserRole.CUSTOMER)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createContactRequestDto: CreateContactRequestDto) {
    return this.contactRequestService.create(createContactRequestDto);
  }

  /**
   * GET /contact-requests
   * Listar todas as solicitações de contato do tenant
   */
  @Get()
  // @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN)
  findAll() {
    return this.contactRequestService.findAll();
  }

  /**
   * GET /contact-requests/:id
   * Obter uma solicitação de contato específica
   */
  @Get(":id")
  // @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN)
  findOne(@Param('id') id: string) {
    return this.contactRequestService.findOne(id);
  }

  /**
   * PATCH /contact-requests/:id
   * Atualizar uma solicitação de contato
   */
  @Patch(":id")
  // @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateContactRequestDto: UpdateContactRequestDto,
  ) {
    return this.contactRequestService.update(id, updateContactRequestDto);
  }

  /**
   * DELETE /contact-requests/:id
   * Deletar uma solicitação de contato
   */
  @Delete(":id")
  // @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.contactRequestService.remove(id);
  }
}
