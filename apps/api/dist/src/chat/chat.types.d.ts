export declare class ChatMessage {
    id: number;
    uuid: string;
    create_date: Date;
    anon_id: string;
    anon_text_color: string;
    anon_background_color: string;
    name?: string | null;
    message: string;
    removed: boolean;
    stream_id: number;
}
