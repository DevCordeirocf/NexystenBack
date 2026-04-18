import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { TenantId } from '../shared/decorators/tenant-id.decorator';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar um novo administrador (Super ou Tenant)' })
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

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
  @HttpCode(HttpStatus.OK)
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
