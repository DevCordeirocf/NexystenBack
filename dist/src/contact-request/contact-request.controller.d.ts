import { ContactRequestService } from './contact-request.service';
import { CreateContactRequestDto } from './dto/create-contact-request.dto';
import { UpdateContactRequestDto } from './dto/update-contact-request.dto';
export declare class ContactRequestController {
    private readonly contactRequestService;
    constructor(contactRequestService: ContactRequestService);
    create(createContactRequestDto: CreateContactRequestDto, user?: any): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        message: string | null;
        status: string;
        productId: string;
        userId: string | null;
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
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        message: string | null;
        status: string;
        productId: string;
        userId: string | null;
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
            description: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            isActive: boolean;
            price: import("@prisma/client/runtime/library").Decimal;
            stock: number;
            images: string[];
            specifications: import("@prisma/client/runtime/library").JsonValue | null;
        };
    } & {
        id: string;
        createdAt: Date;
        tenantId: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        message: string | null;
        status: string;
        productId: string;
        userId: string | null;
    }>;
    update(id: string, updateContactRequestDto: UpdateContactRequestDto): Promise<{
        product: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        tenantId: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        message: string | null;
        status: string;
        productId: string;
        userId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        message: string | null;
        status: string;
        productId: string;
        userId: string | null;
    }>;
}
