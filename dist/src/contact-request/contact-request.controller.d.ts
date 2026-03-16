import { ContactRequestService } from './contact-request.service';
import { CreateContactRequestDto } from './dto/create-contact-request.dto';
import { UpdateContactRequestDto } from './dto/update-contact-request.dto';
export declare class ContactRequestController {
    private readonly contactRequestService;
    constructor(contactRequestService: ContactRequestService);
    create(createContactRequestDto: CreateContactRequestDto): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        productId: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        message: string | null;
        status: string;
    }>;
    findAll(): Promise<({
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
        productId: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        message: string | null;
        status: string;
    })[]>;
    findOne(id: string): Promise<{
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
        productId: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        message: string | null;
        status: string;
    }>;
}
