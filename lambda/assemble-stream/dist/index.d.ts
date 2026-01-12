/**
 * EasyStream Lambda - Assemble uploaded clips into larger stream files.
 *
 * - Download clips from Storj (S3 compatible)
 * - Concatenate them in order into parts of max STREAM_LENGTH_MB (by total clip size)
 * - Upload assembled parts back to Storj
 * - Delete original clips
 *
 * Notes:
 * - This lambda expects ffmpeg to be available in the runtime (either baked in or via a Lambda Layer).
 *   You can override with FFMPEG_PATH env var (default: "ffmpeg").
 * - Storj is used via AWS SDK v2 with the provided config requirement (no forcePathStyle/signatureVersion).
 */
import AWS from 'aws-sdk';
export declare const s3: AWS.S3;
export type AssembleRequest = {
    streamUuid: string;
    /**
     * Provide EITHER clipKeys OR clipUrls. Order matters: concatenation is done in the order provided.
     */
    clipKeys?: string[];
    clipUrls?: string[];
    /**
     * Optional sizes (MB) parallel to the clip list; if omitted, lambda will HEAD each object.
     */
    clipSizesMb?: number[];
    /**
     * Max size (MB) of each assembled output file.
     * Defaults to env STREAM_LENGTH or 250.
     */
    streamLengthMb?: number;
    /**
     * Where to write outputs in the bucket.
     * Default: streams/:streamUuid/assembled
     */
    outputPrefix?: string;
    /**
     * Delete original clips after successful assembly.
     * Default: true
     */
    deleteClips?: boolean;
};
export type AssemblePlan = {
    streamUuid: string;
    groups: Array<{
        partIndex: number;
        clipKeys: string[];
        totalMb: number;
    }>;
};
export declare function buildAssemblePlan(req: AssembleRequest): AssemblePlan;
export type AssembleResult = {
    streamUuid: string;
    assembled: Array<{
        partIndex: number;
        key: string;
        url: string;
        totalMb: number;
    }>;
    deletedClipKeys: string[];
    plan: AssemblePlan;
};
export declare function handler(event: AssembleRequest): Promise<AssembleResult>;
