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
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            description: string | null;
        }[];
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
    }>;
    findAll(categoryId?: string, userRole?: UserRole): Promise<({
        categories: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            description: string | null;
        }[];
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
    findOne(id: string): Promise<{
        categories: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            description: string | null;
        }[];
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
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        categories: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            description: string | null;
        }[];
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
    }>;
    remove(id: string): Promise<{
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
    }>;
    updateStockAndAvailability(id: string, stock?: number, isActive?: boolean): Promise<{
        categories: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            description: string | null;
        }[];
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
    }>;
}
