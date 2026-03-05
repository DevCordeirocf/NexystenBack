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
} from '@nestjs/common';
import { ContactRequestService } from './contact-request.service';
import { CreateContactRequestDto } from './dto/create-contact-request.dto';
import { UpdateContactRequestDto } from './dto/update-contact-request.dto';

@Controller('contact-requests')
export class ContactRequestController {
  constructor(private readonly contactRequestService: ContactRequestService) {}

  /**
   * POST /contact-requests
   * Criar uma nova solicitação de contato
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createContactRequestDto: CreateContactRequestDto) {
    return this.contactRequestService.create(createContactRequestDto);
  }

  /**
   * GET /contact-requests
   * Listar todas as solicitações de contato do tenant
   */
  @Get()
  findAll() {
    return this.contactRequestService.findAll();
  }

  /**
   * GET /contact-requests/:id
   * Obter uma solicitação de contato específica
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactRequestService.findOne(id);
  }

  /**
   * PATCH /contact-requests/:id
   * Atualizar uma solicitação de contato
   */
  @Patch(':id')
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
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.contactRequestService.remove(id);
  }
}
