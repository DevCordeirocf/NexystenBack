import { ContactRequestService } from './contact-request.service';
import { CreateContactRequestDto } from './dto/create-contact-request.dto';
import { UpdateContactRequestDto } from './dto/update-contact-request.dto';
export declare class ContactRequestController {
    private readonly contactRequestService;
    constructor(contactRequestService: ContactRequestService);
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
