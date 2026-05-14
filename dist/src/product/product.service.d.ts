import { PrismaService } from '../database/prisma.service';
import { TenantContextService } from '../tenant/tenant-context.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UserRole } from '@prisma/client';
export declare class ProductService {
    private readonly prisma;
    private readonly tenantContextService;
    constructor(prisma: PrismaService, tenantContextService: TenantContextService);
    create(createProductDto: CreateProductDto): Promise<{
        categories: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
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
    }>;
    findAll(categoryId?: string, userRole?: UserRole): Promise<({
        categories: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
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
    findOne(id: string): Promise<{
        categories: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
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
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        categories: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
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
    }>;
    remove(id: string): Promise<{
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
    }>;
    updateStockAndAvailability(id: string, stock?: number, isActive?: boolean): Promise<{
        categories: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
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
    }>;
}
