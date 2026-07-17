import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterMasterDto } from './dto/register-master.dto';
import { RegisterTenantAdminDto } from './dto/register-tenant-admin.dto';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { TenantId } from '../shared/decorators/tenant-id.decorator';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUser } from './get-user.decorator';
import { Public } from './public.decorator';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-master')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Registrar um novo MASTER_ADMIN (Apenas Master Admin)' })
  @HttpCode(HttpStatus.CREATED)
  registerMaster(
    @Body() registerMasterDto: RegisterMasterDto,
    @GetUser() currentUser: any
  ) {
    return this.authService.registerMaster(registerMasterDto, currentUser);
  }

  @Post('register-tenant')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Registrar um novo TENANT_ADMIN (Apenas Master Admin)' })
  @HttpCode(HttpStatus.CREATED)
  registerTenantAdmin(
    @Body() registerTenantAdminDto: RegisterTenantAdminDto,
    @GetUser() currentUser: any
  ) {
    return this.authService.registerTenantAdmin(registerTenantAdminDto, currentUser);
  }

  @Public()
  @Post('register-customer')
  @ApiOperation({ summary: 'Registrar um novo cliente (Lead)' })
  @ApiHeader({ name: 'X-Tenant-ID', description: 'ID ou nome do tenant', required: true })
  @HttpCode(HttpStatus.CREATED)
  registerCustomer(
    @Body() registerCustomerDto: RegisterCustomerDto,
    @TenantId() tenantId: string,
  ) {
    return this.authService.registerCustomer(registerCustomerDto, tenantId);
  }

  @Post('login')
  @ApiOperation({ summary: 'Realizar login e obter token JWT' })
  @ApiHeader({ name: 'X-Tenant-ID', description: 'ID ou nome do tenant para login de usuarios de loja. MASTER_ADMIN pode logar sem tenant.', required: false })
  @HttpCode(HttpStatus.OK)
  login(
    @Body() loginUserDto: LoginUserDto,
    @TenantId() tenantId?: string,
  ) {
    return this.authService.login(loginUserDto, tenantId);
  }
}
