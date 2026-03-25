export declare class CreateProductDto {
    name: string;
    description: string;
    price: number;
    images: string[];
    specifications?: Record<string, any>;
    isAvailable?: boolean;
    categoryIds?: string[];
}
