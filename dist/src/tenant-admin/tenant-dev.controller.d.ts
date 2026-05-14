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
        tenantId: string | null;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
    }[]>;
    findAllProducts(): Promise<({
        tenant: {
            name: string;
        };
        categories: {
            name: string;
        }[];
    } & {
        id: string;
        name: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        isActive: boolean;
        price: import("@prisma/client-runtime-utils").Decimal;
        stock: number;
        images: string[];
        specifications: import("@prisma/client/runtime/client").JsonValue | null;
    })[]>;
    findAllCategories(): Promise<({
        tenant: {
            name: string;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    })[]>;
    findAllLeads(): Promise<({
        tenant: {
            name: string;
        };
        product: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        tenantId: string;
        message: string | null;
        productId: string;
        userId: string | null;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        status: string;
    })[]>;
}
