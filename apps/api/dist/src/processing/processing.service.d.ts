import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { UploadsService } from '../uploads/uploads.service';
export declare class ProcessingService {
    private readonly prisma;
    private readonly uploads;
    private readonly config;
    private readonly logger;
    constructor(prisma: PrismaService, uploads: UploadsService, config: ConfigService);
    processStreamToPast(streamUuid: string): Promise<void>;
    private runFfmpegConcat;
    private deleteClipsBestEffort;
}
