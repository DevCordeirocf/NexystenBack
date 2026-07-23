import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { LoginUserDto } from './dto/login-user.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    registerMaster(registerMasterDto: any, currentUser: any): Promise<{
        message: string;
    }>;
    registerTenantAdmin(registerTenantAdminDto: any, currentUser: any): Promise<{
        message: string;
    }>;
    registerCustomer(registerCustomerDto: RegisterCustomerDto, tenantId: string): Promise<{
        message: string;
        userId: string;
    }>;
    login(loginUserDto: LoginUserDto, tenantId?: string): Promise<{
        access_token: string;
    }>;
    validateUser(payload: any): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        email: string;
        password: string;
        phone: string | null;
    } | null>;
}
