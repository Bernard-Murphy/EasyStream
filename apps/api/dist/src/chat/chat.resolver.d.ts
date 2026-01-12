import { ChatService } from './chat.service';
export declare class ChatResolver {
    private readonly chat;
    constructor(chat: ChatService);
    chatMessages(streamUuid: string): Promise<{
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
    sendChatMessage(streamUuid: string, message: string, name?: string, anon_id?: string, anon_text_color?: string, anon_background_color?: string): Promise<{
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
    chatMessageAdded(streamUuid: string): import("graphql-subscriptions/dist/pubsub-async-iterable-iterator").PubSubAsyncIterableIterator<unknown>;
}
