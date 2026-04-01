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
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        images: string[];
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    findAll(categoryId?: string, user?: User): Promise<({
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
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        images: string[];
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
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
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        images: string[];
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
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
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        images: string[];
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    updateStockAndAvailability(id: string, updateStockAvailabilityDto: UpdateStockAvailabilityDto): Promise<{
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
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        images: string[];
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        isActive: boolean;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        images: string[];
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
