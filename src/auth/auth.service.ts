import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const { email, password, role, tenantId, name, phone } = registerUserDto;

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Role-based tenantId validation
    if (role === UserRole.MASTER_ADMIN && tenantId) {
      throw new BadRequestException('MASTER_ADMIN cannot be assigned to a specific tenant.');
    }
    if (role === UserRole.TENANT_ADMIN && !tenantId) {
      throw new BadRequestException('TENANT_ADMIN must be assigned to a tenant.');
    }
    // For CUSTOMERs, tenantId is optional. If provided, it links them to a specific store.

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || UserRole.CUSTOMER,
        tenantId: (role === UserRole.TENANT_ADMIN || role === UserRole.CUSTOMER) ? tenantId : null,
        name,
        phone,
      },
    });

    // If a TENANT_ADMIN is created, link them to the TenantStore
    if (role === UserRole.TENANT_ADMIN && tenantId) {
      await this.prisma.tenantStore.update({
        where: { id: tenantId },
        data: {
          users: { connect: { id: user.id } }, // Changed from admins to users as per schema update
        },
      });
    }

    return { message: 'User registered successfully' };
  }

  async registerCustomer(registerCustomerDto: RegisterCustomerDto, tenantId: string) {
    const { email, password, name, phone } = registerCustomerDto;

    const existingUser = await this.prisma.user.findFirst({
      where: { email, tenantId },
    });
    if (existingUser) {
      throw new BadRequestException('Customer with this email already exists for this tenant.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: UserRole.CUSTOMER,
        tenantId,
        name,
        phone,
      },
    });

    return { message: 'Customer registered successfully', userId: user.id };
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const payload = { email: user.email, sub: user.id, role: user.role, tenantId: user.tenantId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(payload: any) {
    return this.prisma.user.findUnique({ where: { id: payload.sub } });
  }
}
