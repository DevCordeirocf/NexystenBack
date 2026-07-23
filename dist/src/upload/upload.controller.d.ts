import { Request } from 'express';
export declare class UploadController {
    uploadImage(file: Express.Multer.File, request: Request): Promise<{
        url: string;
        filename: string;
        mimeType: string;
        size: number;
    }>;
    uploadImages(files: Express.Multer.File[], request: Request): Promise<{
        url: string;
        filename: string;
        mimeType: string;
        size: number;
    }[]>;
    private persistImage;
    private getTenantId;
    private detectImageType;
}
