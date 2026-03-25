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
        createdAt: Date;
        tenantId: string;
        userId: string | null;
        productId: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        message: string | null;
        status: string;
    }>;
    findAll(): Promise<({
        user: {
            name: string | null;
            id: string;
            email: string;
            phone: string | null;
        } | null;
        product: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        tenantId: string;
        userId: string | null;
        productId: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        message: string | null;
        status: string;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            name: string | null;
            id: string;
            email: string;
            phone: string | null;
        } | null;
        product: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        tenantId: string;
        userId: string | null;
        productId: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        message: string | null;
        status: string;
    }>;
    update(id: string, updateContactRequestDto: UpdateContactRequestDto): Promise<{
        product: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        tenantId: string;
        userId: string | null;
        productId: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        message: string | null;
        status: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        userId: string | null;
        productId: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        message: string | null;
        status: string;
    }>;
}
