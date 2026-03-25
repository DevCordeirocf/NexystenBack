import { PrismaService } from '../database/prisma.service';
import { TenantContextService } from '../tenant/tenant-context.service';
import { CreateContactRequestDto } from './dto/create-contact-request.dto';
import { UpdateContactRequestDto } from './dto/update-contact-request.dto';
export declare class ContactRequestService {
    private readonly prisma;
    private readonly tenantContextService;
    constructor(prisma: PrismaService, tenantContextService: TenantContextService);
    create(createContactRequestDto: CreateContactRequestDto): Promise<{
        id: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        message: string | null;
        status: string;
        createdAt: Date;
        tenantId: string;
        productId: string;
    }>;
    findAll(): Promise<({
        product: {
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
        };
    } & {
        id: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        message: string | null;
        status: string;
        createdAt: Date;
        tenantId: string;
        productId: string;
    })[]>;
    findOne(id: string): Promise<{
        product: {
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
        };
    } & {
        id: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        message: string | null;
        status: string;
        createdAt: Date;
        tenantId: string;
        productId: string;
    }>;
    update(id: string, updateContactRequestDto: UpdateContactRequestDto): Promise<{
        product: {
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
        };
    } & {
        id: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        message: string | null;
        status: string;
        createdAt: Date;
        tenantId: string;
        productId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        message: string | null;
        status: string;
        createdAt: Date;
        tenantId: string;
        productId: string;
    }>;
}
