export class ProductDto {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  price: string;
  isAvailable: boolean;
  images: string[];
  specifications?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
