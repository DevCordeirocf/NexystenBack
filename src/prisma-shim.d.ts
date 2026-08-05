declare module '@prisma/client' {
  // Minimal shims to allow TypeScript to compile when generated Prisma client types are missing.
  // This file provides fallback typings for the symbols used by the application. It should
  // be removed if you generate Prisma client types with `prisma generate` and the real
  // types are available.

  export type User = any;

  export enum UserRole {
    MASTER_ADMIN = 'MASTER_ADMIN',
    TENANT_ADMIN = 'TENANT_ADMIN',
    CUSTOMER = 'CUSTOMER',
  }

  export class PrismaClient {
    constructor(options?: any);
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    $transaction<T = any>(arg: any): Promise<T>;
    // Allow arbitrary model access (e.g., prisma.user.create)
    [key: string]: any;
  }

  export const Prisma: any;
}
