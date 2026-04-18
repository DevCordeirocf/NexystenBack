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
            description: string | null;
            tenantId: string;
        }[];
    } & {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        stock: number;
        tenantId: string;
    }>;
    findAll(categoryId?: string, user?: User): Promise<({
        categories: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            tenantId: string;
        }[];
    } & {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        stock: number;
        tenantId: string;
    })[]>;
    findOne(id: string): Promise<{
        categories: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            tenantId: string;
        }[];
    } & {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        stock: number;
        tenantId: string;
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        categories: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            tenantId: string;
        }[];
    } & {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        stock: number;
        tenantId: string;
    }>;
    updateStockAndAvailability(id: string, updateStockAvailabilityDto: UpdateStockAvailabilityDto): Promise<{
        categories: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            tenantId: string;
        }[];
    } & {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        stock: number;
        tenantId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        stock: number;
        tenantId: string;
    }>;
}
