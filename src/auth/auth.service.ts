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

  /**
   * Registra um novo usuário no sistema (Admin ou Lojista)
   */
  async register(registerUserDto: RegisterUserDto) {
    const { email, password, role, tenantId, name, phone } = registerUserDto;

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Já existe um usuário cadastrado com este e-mail.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Validações de vínculo com Tenant baseadas na Role
    if (role === UserRole.MASTER_ADMIN && tenantId) {
      throw new BadRequestException('Um MASTER_ADMIN não pode ser vinculado a um tenant específico.');
    }
    if (role === UserRole.TENANT_ADMIN && !tenantId) {
      throw new BadRequestException('Um TENANT_ADMIN deve obrigatoriamente estar vinculado a um tenant.');
    }

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

    // Vincula o administrador à loja correspondente
    if (role === UserRole.TENANT_ADMIN && tenantId) {
      await this.prisma.tenantStore.update({
        where: { id: tenantId },
        data: {
          users: { connect: { id: user.id } },
        },
      });
    }

    return { message: 'Usuário registrado com sucesso' };
  }

  /**
   * Registra um cliente final vinculado a uma loja específica
   */
  async registerCustomer(registerCustomerDto: RegisterCustomerDto, tenantId: string) {
    const { email, password, name, phone } = registerCustomerDto;

    const existingUser = await this.prisma.user.findFirst({
      where: { email, tenantId },
    });
    if (existingUser) {
      throw new BadRequestException('Já existe um cliente cadastrado com este e-mail para esta loja.');
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

    return { message: 'Cliente registrado com sucesso', userId: user.id };
  }

  /**
   * Realiza a autenticação do usuário e gera o token JWT
   */
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role, 
      tenantId: user.tenantId 
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Valida o usuário a partir do payload do token
   */
  async validateUser(payload: any) {
    return this.prisma.user.findUnique({ where: { id: payload.sub } });
  }
}
