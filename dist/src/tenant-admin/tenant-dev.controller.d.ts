import { PrismaService } from '../database/prisma.service';
export declare class TenantDevController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAllIds(): Promise<{
        id: string;
        name: string;
        isActive: boolean;
    }[]>;
    resetTenant(tenantId: string): Promise<{
        message: string;
    }>;
    seedTenant(tenantId: string): Promise<{
        message: string;
        data: {
            categories: number;
            products: number;
            leads: number;
        };
    }>;
    findAllUsers(): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        tenantId: string | null;
    }[]>;
    findAllProducts(): Promise<({
        categories: {
            name: string;
        }[];
        tenant: {
            name: string;
        };
    } & {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        stock: number;
    })[]>;
    findAllCategories(): Promise<({
        tenant: {
            name: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
    })[]>;
    findAllLeads(): Promise<({
        product: {
            name: string;
        };
        tenant: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        tenantId: string;
        message: string | null;
        userId: string | null;
        productId: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        status: string;
    })[]>;
}
