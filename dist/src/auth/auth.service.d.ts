import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { LoginUserDto } from './dto/login-user.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(registerUserDto: RegisterUserDto): Promise<{
        message: string;
    }>;
    registerCustomer(registerCustomerDto: RegisterCustomerDto, tenantId: string): Promise<{
        message: string;
        userId: string;
    }>;
    login(loginUserDto: LoginUserDto): Promise<{
        access_token: string;
    }>;
    validateUser(payload: any): Promise<{
        name: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string | null;
        email: string;
        password: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
    } | null>;
}
