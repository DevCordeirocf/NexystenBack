import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
declare const PrismaClient: any;
import '../config/load-env';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
export {};
