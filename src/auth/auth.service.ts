import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterMasterDto } from './dto/register-master.dto';
import { RegisterTenantAdminDto } from './dto/register-tenant-admin.dto';
import { UserRole, User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registra um novo MASTER_ADMIN (Apenas outro MASTER_ADMIN pode realizar esta ação)
   */
  async registerMaster(registerMasterDto: RegisterMasterDto, currentUser: User) {
    if (!currentUser || currentUser.role !== UserRole.MASTER_ADMIN) {
      throw new UnauthorizedException('Apenas um MASTER_ADMIN pode criar outros administradores master.');
    }

    const { password, name } = registerMasterDto;
    const email = this.normalizeEmail(registerMasterDto.email);

    const existingUser = await this.prisma.user.findFirst({
      where: { email, tenantId: null, role: UserRole.MASTER_ADMIN },
    });
    if (existingUser) {
      throw new BadRequestException('Já existe um usuário cadastrado com este e-mail.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: UserRole.MASTER_ADMIN,
        name,
      },
    });

    return { message: 'Administrador Master registrado com sucesso' };
  }

  /**
   * Registra um novo TENANT_ADMIN vinculado a uma loja (Apenas MASTER_ADMIN pode realizar esta ação)
   */
  async registerTenantAdmin(registerTenantAdminDto: RegisterTenantAdminDto, currentUser: User) {
    if (!currentUser || currentUser.role !== UserRole.MASTER_ADMIN) {
      throw new UnauthorizedException('Apenas um MASTER_ADMIN pode criar administradores de loja.');
    }

    const { password, name, tenantId } = registerTenantAdminDto;
    const email = this.normalizeEmail(registerTenantAdminDto.email);

    const existingUser = await this.prisma.user.findFirst({
      where: { email, tenantId },
    });
    if (existingUser) {
      throw new BadRequestException('Já existe um usuário cadastrado com este e-mail.');
    }

    const tenantExists = await this.prisma.tenantStore.findUnique({ where: { id: tenantId } });
    if (!tenantExists) {
      throw new BadRequestException('O tenant informado não existe.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: UserRole.TENANT_ADMIN,
        tenantId,
        name,
      },
    });

    // Vincula o administrador à loja correspondente
    await this.prisma.tenantStore.update({
      where: { id: tenantId },
      data: {
        users: { connect: { id: user.id } },
      },
    });

    return { message: 'Administrador de Loja registrado com sucesso' };
  }

  /**
   * Registra um cliente final vinculado a uma loja específica
   */
  async registerCustomer(registerCustomerDto: RegisterCustomerDto, tenantId: string) {
    const { password, name, phone } = registerCustomerDto;
    const email = this.normalizeEmail(registerCustomerDto.email);

    if (!tenantId) {
      throw new BadRequestException('Tenant ID e obrigatorio para cadastrar um cliente.');
    }

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
  async login(loginUserDto: LoginUserDto, tenantId?: string) {
    const { password } = loginUserDto;
    const email = this.normalizeEmail(loginUserDto.email);

    const user = tenantId
      ? await this.prisma.user.findFirst({ where: { email, tenantId } })
      : await this.prisma.user.findFirst({
          where: { email, tenantId: null, role: UserRole.MASTER_ADMIN },
        });
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

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }
}
