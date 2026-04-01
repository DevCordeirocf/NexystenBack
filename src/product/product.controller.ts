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
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole, User } from '@prisma/client';
import { GetUser } from '../auth/get-user.decorator';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateStockAvailabilityDto } from './dto/update-stock-availability.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Cria um novo produto.
   * Apenas MASTER_ADMIN e TENANT_ADMIN podem criar produtos.
   */
  @Post()
  @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  /**
   * Lista todos os produtos do tenant atual.
   * Pode ser filtrado por categoryId.
   * Acesso permitido para MASTER_ADMIN, TENANT_ADMIN e CUSTOMER.
   */
  @Get()
  @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN, UserRole.CUSTOMER)
  findAll(
    @Query('categoryId') categoryId?: string,
    @GetUser() user?: User,
  ) {
    return this.productService.findAll(categoryId, user?.role);
  }

  /**
   * Obtém um produto específico pelo ID.
   * Acesso permitido para MASTER_ADMIN, TENANT_ADMIN e CUSTOMER.
   */
  @Get(':id')
  @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN, UserRole.CUSTOMER)
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  /**
   * Atualiza um produto existente pelo ID.
   * Apenas MASTER_ADMIN e TENANT_ADMIN podem atualizar produtos.
   */
  @Patch(':id')
  @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  /**
   * Atualiza o estoque e a disponibilidade de um produto existente pelo ID.
   * Apenas MASTER_ADMIN e TENANT_ADMIN podem atualizar o estoque/disponibilidade.
   */
  @Patch(':id/stock-availability')
  @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN)
  updateStockAndAvailability(
    @Param('id') id: string,
    @Body() updateStockAvailabilityDto: UpdateStockAvailabilityDto,
  ) {
    const { stock, isActive } = updateStockAvailabilityDto;
    return this.productService.updateStockAndAvailability(id, stock, isActive);
  }

  /**
   * Remove um produto pelo ID.
   * Apenas MASTER_ADMIN e TENANT_ADMIN podem remover produtos.
   */
  @Delete(':id')
  @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
