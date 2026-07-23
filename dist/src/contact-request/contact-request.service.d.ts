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
        userId: string | null;
        productId: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        status: string;
    }>;
    findAll(status?: string): Promise<({
        user: {
            id: string;
            name: string | null;
            email: string;
            phone: string | null;
        } | null;
        product: {
            id: string;
            name: string;
            images: string[];
        };
    } & {
        id: string;
        createdAt: Date;
        tenantId: string;
        message: string | null;
        userId: string | null;
        productId: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        status: string;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            name: string | null;
            email: string;
            phone: string | null;
        } | null;
        product: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        tenantId: string;
        message: string | null;
        userId: string | null;
        productId: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        status: string;
    }>;
    update(id: string, updateContactRequestDto: UpdateContactRequestDto): Promise<{
        product: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        tenantId: string;
        message: string | null;
        userId: string | null;
        productId: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        status: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        message: string | null;
        userId: string | null;
        productId: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        status: string;
    }>;
    private ensureUserBelongsToTenant;
}
