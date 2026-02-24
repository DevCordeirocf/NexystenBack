import { AsyncLocalStorage } from 'async_hooks';
interface TenantStore {
    tenantId: string;
}
export declare const tenantStore: AsyncLocalStorage<TenantStore>;
export declare class TenantContextService {
    run(tenantId: string, callback: () => void): void;
    getTenantId(): string | undefined;
    getRequiredTenantId(): string;
}
export {};
