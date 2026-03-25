import { TenantAdminService } from './tenant-admin.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
export declare class TenantAdminController {
    private readonly tenantAdminService;
    constructor(tenantAdminService: TenantAdminService);
    create(createTenantDto: CreateTenantDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        themeConfig: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    findAll(): Promise<({
        admins: {
            id: string;
            email: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        themeConfig: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    findOne(id: string): Promise<{
        admins: {
            id: string;
            email: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        themeConfig: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    update(id: string, updateTenantDto: UpdateTenantDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        themeConfig: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        themeConfig: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
