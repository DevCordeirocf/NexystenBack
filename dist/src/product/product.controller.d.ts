import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { User } from '@prisma/client';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateStockAvailabilityDto } from './dto/update-stock-availability.dto';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
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
        price: import("@prisma/client-runtime-utils").Decimal;
        images: string[];
        specifications: import("@prisma/client/runtime/client").JsonValue | null;
        stock: number;
    }>;
    findAll(categoryId?: string, user?: User): Promise<({
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
        price: import("@prisma/client-runtime-utils").Decimal;
        images: string[];
        specifications: import("@prisma/client/runtime/client").JsonValue | null;
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
        price: import("@prisma/client-runtime-utils").Decimal;
        images: string[];
        specifications: import("@prisma/client/runtime/client").JsonValue | null;
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
        price: import("@prisma/client-runtime-utils").Decimal;
        images: string[];
        specifications: import("@prisma/client/runtime/client").JsonValue | null;
        stock: number;
    }>;
    updateStockAndAvailability(id: string, updateStockAvailabilityDto: UpdateStockAvailabilityDto): Promise<{
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
        price: import("@prisma/client-runtime-utils").Decimal;
        images: string[];
        specifications: import("@prisma/client/runtime/client").JsonValue | null;
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
        price: import("@prisma/client-runtime-utils").Decimal;
        images: string[];
        specifications: import("@prisma/client/runtime/client").JsonValue | null;
        stock: number;
    }>;
}
