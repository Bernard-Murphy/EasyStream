export declare enum StreamStatus {
    live = "live",
    processing = "processing",
    past = "past"
}
export declare class Stream {
    id: number;
    uuid: string;
    start_time: Date;
    end_time?: Date | null;
    anon_id: string;
    anon_text_color: string;
    anon_background_color: string;
    title: string;
    description: string;
    status: StreamStatus;
    removed: boolean;
    fileUrls: string[];
    thumbnailUrl?: string | null;
}
