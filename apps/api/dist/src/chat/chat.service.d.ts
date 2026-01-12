import { PrismaService } from '../prisma/prisma.service';
export declare class ChatService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listMessages(streamUuid: string): Promise<{
        uuid: string;
        id: number;
        create_date: Date;
        name: string | null;
        anon_id: string;
        anon_text_color: string;
        anon_background_color: string;
        removed: boolean;
        stream_id: number;
        message: string;
    }[]>;
    sendMessage(input: {
        streamUuid: string;
        message: string;
        name?: string | null;
        anon?: {
            anon_id: string;
            anon_text_color: string;
            anon_background_color: string;
        };
    }): Promise<{
        uuid: string;
        id: number;
        create_date: Date;
        name: string | null;
        anon_id: string;
        anon_text_color: string;
        anon_background_color: string;
        removed: boolean;
        stream_id: number;
        message: string;
    }>;
}
