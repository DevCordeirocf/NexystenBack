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
        message: string | null;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        status: string;
        productId: string;
        userId: string | null;
    }>;
    findAll(status?: string): Promise<({
        product: {
            id: string;
            name: string;
            images: string[];
        };
        user: {
            id: string;
            name: string | null;
            email: string;
            phone: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        tenantId: string;
        message: string | null;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        status: string;
        productId: string;
        userId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        product: {
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
        };
        user: {
            id: string;
            name: string | null;
            email: string;
            phone: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        tenantId: string;
        message: string | null;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        status: string;
        productId: string;
        userId: string | null;
    }>;
    update(id: string, updateContactRequestDto: UpdateContactRequestDto): Promise<{
        product: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        tenantId: string;
        message: string | null;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        status: string;
        productId: string;
        userId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        message: string | null;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        status: string;
        productId: string;
        userId: string | null;
    }>;
}
