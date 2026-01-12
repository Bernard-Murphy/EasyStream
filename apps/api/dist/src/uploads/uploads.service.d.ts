import { ConfigService } from '@nestjs/config';
export declare class UploadsService {
    private readonly config;
    constructor(config: ConfigService);
    makeKey(prefix: string, ext: string): string;
    putBuffer(params: {
        key: string;
        contentType: string;
        body: Buffer;
    }): Promise<{
        url: string;
        key: string;
    }>;
    putFile(params: {
        key: string;
        contentType: string;
        filePath: string;
    }): Promise<{
        url: string;
        key: string;
    }>;
    getLocalPathFromKey(key: string): string;
    extractKeyFromUrl(url: string): string | null;
}
