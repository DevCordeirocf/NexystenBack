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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { UpdateProductDto } from './dto/update-product.dto';

// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * POST /products
   * Criar um novo produto
   */
  @Post()
  // @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  /**
   * GET /products
   * Listar todos os produtos do tenant
   */
  @Get()
  // @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN, UserRole.CUSTOMER)
  findAll() {
    return this.productService.findAll();
  }

  /**
   * GET /products/:id
   * Obter um produto específico
   */
  @Get(":id")
  // @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN, UserRole.CUSTOMER)
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  /**
   * PATCH /products/:id
   * Atualizar um produto
   */
  @Patch(":id")
  // @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  /**
   * DELETE /products/:id
   * Deletar um produto
   */
  @Delete(":id")
  // @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
