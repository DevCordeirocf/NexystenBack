import { UserRole } from '@prisma/client';
export declare class RegisterUserDto {
    email: string;
    password: string;
    role?: UserRole;
    tenantId?: string;
}
