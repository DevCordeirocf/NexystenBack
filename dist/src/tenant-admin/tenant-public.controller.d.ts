import { PrismaService } from '../database/prisma.service';
export declare class TenantPublicController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByName(name: string): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        themeConfig: import("@prisma/client/runtime/client").JsonValue;
        logoUrl: string | null;
        whatsapp: string | null;
    }>;
}
