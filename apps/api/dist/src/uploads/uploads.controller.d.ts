import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { UploadsService } from './uploads.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class UploadsController {
    private readonly config;
    private readonly uploads;
    private readonly prisma;
    constructor(config: ConfigService, uploads: UploadsService, prisma: PrismaService);
    uploadClip(req: Request, file: Express.Multer.File): Promise<{
        url: string;
        key: string;
    }>;
    uploadThumbnail(req: Request, file: Express.Multer.File): Promise<{
        url: string;
        key: string;
    }>;
}
