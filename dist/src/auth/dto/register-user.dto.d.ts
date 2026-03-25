import { UserRole } from '@prisma/client';
export declare class RegisterUserDto {
    email: string;
    password: string;
    name?: string;
    phone?: string;
    role?: UserRole;
    tenantId?: string;
}
