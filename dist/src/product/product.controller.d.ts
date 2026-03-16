import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(createProductDto: CreateProductDto): Promise<{
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
    findAll(): Promise<{
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
    }[]>;
    findOne(id: string): Promise<{
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
