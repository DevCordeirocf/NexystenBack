import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(registerUserDto: RegisterUserDto): Promise<{
        message: string;
    }>;
    login(loginUserDto: LoginUserDto): Promise<{
        access_token: string;
    }>;
    validateUser(payload: any): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string | null;
        updatedAt: Date;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.UserRole;
    } | null>;
}
