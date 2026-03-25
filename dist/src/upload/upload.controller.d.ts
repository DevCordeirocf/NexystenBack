export declare class UploadController {
    uploadImage(file: Express.Multer.File): {
        url: string;
        filename: string;
    };
    uploadImages(files: Express.Multer.File[]): {
        url: string;
        filename: string;
    }[];
}
