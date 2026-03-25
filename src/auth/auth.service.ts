import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const { email, password, role, tenantId } = registerUserDto;

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Only MASTER_ADMIN can create other MASTER_ADMINs or assign tenantId
    if (role === UserRole.MASTER_ADMIN && tenantId) {
      throw new BadRequestException('MASTER_ADMIN cannot be assigned to a specific tenant.');
    }
    if (role === UserRole.TENANT_ADMIN && !tenantId) {
      throw new BadRequestException('TENANT_ADMIN must be assigned to a tenant.');
    }
    if (role === UserRole.CUSTOMER && tenantId) {
      throw new BadRequestException('CUSTOMER cannot be assigned to a specific tenant.');
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || UserRole.CUSTOMER,
        tenantId: role === UserRole.TENANT_ADMIN ? tenantId : null,
      },
    });

    // If a TENANT_ADMIN is created, link them to the TenantStore
    if (role === UserRole.TENANT_ADMIN && tenantId) {
      await this.prisma.tenantStore.update({
        where: { id: tenantId },
        data: {
          admins: { connect: { id: user.id } },
        },
      });
    }

    return { message: 'User registered successfully' };
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
