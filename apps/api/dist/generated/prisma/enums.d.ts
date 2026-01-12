export declare const StreamStatus: {
    readonly live: "live";
    readonly processing: "processing";
    readonly past: "past";
};
export type StreamStatus = (typeof StreamStatus)[keyof typeof StreamStatus];
