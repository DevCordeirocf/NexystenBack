import { ContactRequestService } from './contact-request.service';
import { CreateContactRequestDto } from './dto/create-contact-request.dto';
import { UpdateContactRequestDto } from './dto/update-contact-request.dto';
export declare class ContactRequestController {
    private readonly contactRequestService;
    constructor(contactRequestService: ContactRequestService);
    create(createContactRequestDto: CreateContactRequestDto, user?: any): Promise<{
        id: string;
        createdAt: Date;
        message: string | null;
        tenantId: string;
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
        message: string | null;
        tenantId: string;
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
            description: string;
            price: import("@prisma/client/runtime/library").Decimal;
            images: string[];
            specifications: import("@prisma/client/runtime/library").JsonValue | null;
            stock: number;
            tenantId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        message: string | null;
        tenantId: string;
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
            description: string;
            price: import("@prisma/client/runtime/library").Decimal;
            images: string[];
            specifications: import("@prisma/client/runtime/library").JsonValue | null;
            stock: number;
            tenantId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        message: string | null;
        tenantId: string;
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
        message: string | null;
        tenantId: string;
        userId: string | null;
        productId: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        status: string;
    }>;
}
