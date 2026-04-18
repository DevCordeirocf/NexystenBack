import { PrismaService } from '../database/prisma.service';
export declare class TenantDevController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAllIds(): Promise<{
        id: string;
        name: string;
        isActive: boolean;
    }[]>;
}
