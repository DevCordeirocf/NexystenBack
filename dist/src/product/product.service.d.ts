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
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        isActive: boolean;
        images: string[];
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
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
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        isActive: boolean;
        images: string[];
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
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
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        isActive: boolean;
        images: string[];
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
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
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        isActive: boolean;
        images: string[];
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        isActive: boolean;
        images: string[];
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
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
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        isActive: boolean;
        images: string[];
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    }>;
}
