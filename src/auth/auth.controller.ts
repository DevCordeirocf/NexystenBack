import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { TenantId } from '../shared/decorators/tenant-id.decorator';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('register-customer')
  @HttpCode(HttpStatus.CREATED)
  registerCustomer(
    @Body() registerCustomerDto: RegisterCustomerDto,
    @TenantId() tenantId: string,
  ) {
    return this.authService.registerCustomer(registerCustomerDto, tenantId);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
