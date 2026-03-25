import { PrismaService } from '../database/prisma.service';
import { TenantContextService } from '../tenant/tenant-context.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductService {
    private readonly prisma;
    private readonly tenantContextService;
    constructor(prisma: PrismaService, tenantContextService: TenantContextService);
    create(createProductDto: CreateProductDto): Promise<{
        categories: {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
        }[];
    } & {
        name: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        isAvailable: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    }>;
    findAll(): Promise<({
        categories: {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
        }[];
    } & {
        name: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        isAvailable: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    })[]>;
    findOne(id: string): Promise<{
        categories: {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
        }[];
    } & {
        name: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        isAvailable: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        categories: {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
        }[];
    } & {
        name: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        isAvailable: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    }>;
    remove(id: string): Promise<{
        name: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        isAvailable: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    }>;
}
