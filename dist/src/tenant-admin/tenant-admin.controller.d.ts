import { TenantAdminService } from './tenant-admin.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
export declare class TenantAdminController {
    private readonly tenantAdminService;
    constructor(tenantAdminService: TenantAdminService);
    create(createTenantDto: CreateTenantDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        themeConfig: import("@prisma/client/runtime/library").JsonValue | null;
        logoUrl: string | null;
        whatsapp: string | null;
    }>;
    findAll(): Promise<({
        users: {
            id: string;
            email: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        themeConfig: import("@prisma/client/runtime/library").JsonValue | null;
        logoUrl: string | null;
        whatsapp: string | null;
    })[]>;
    findOne(id: string): Promise<{
        users: {
            id: string;
            email: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        themeConfig: import("@prisma/client/runtime/library").JsonValue | null;
        logoUrl: string | null;
        whatsapp: string | null;
    }>;
    update(id: string, updateTenantDto: UpdateTenantDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        themeConfig: import("@prisma/client/runtime/library").JsonValue | null;
        logoUrl: string | null;
        whatsapp: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        themeConfig: import("@prisma/client/runtime/library").JsonValue | null;
        logoUrl: string | null;
        whatsapp: string | null;
    }>;
}
