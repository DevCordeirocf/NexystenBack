export declare class ContactRequestDto {
    id: string;
    tenantId: string;
    productId: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    message?: string;
    status: string;
    createdAt: Date;
}
