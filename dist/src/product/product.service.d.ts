import { PrismaService } from '../database/prisma.service';
import { TenantContextService } from '../tenant/tenant-context.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductService {
    private readonly prisma;
    private readonly tenantContextService;
    constructor(prisma: PrismaService, tenantContextService: TenantContextService);
    create(createProductDto: CreateProductDto): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        name: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        isAvailable: boolean;
        images: string[];
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        name: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        isAvailable: boolean;
        images: string[];
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        name: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        isAvailable: boolean;
        images: string[];
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        updatedAt: Date;
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        name: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        isAvailable: boolean;
        images: string[];
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        name: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        isAvailable: boolean;
        images: string[];
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        updatedAt: Date;
    }>;
}
