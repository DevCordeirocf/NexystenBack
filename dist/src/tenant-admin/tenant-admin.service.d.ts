import { PrismaService } from '../database/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
export declare class TenantAdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createTenantDto: CreateTenantDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        themeConfig: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    findAll(): Promise<({
        users: {
            id: string;
            email: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        themeConfig: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    findOne(id: string): Promise<{
        users: {
            id: string;
            email: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        themeConfig: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    update(id: string, updateTenantDto: UpdateTenantDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        themeConfig: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        themeConfig: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
