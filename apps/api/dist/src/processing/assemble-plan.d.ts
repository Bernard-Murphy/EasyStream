export type AssembleRequest = {
    streamUuid: string;
    clipUrls: string[];
    clipSizesMb: number[];
    streamLengthMb: number;
};
export type AssemblePlan = {
    streamUuid: string;
    groups: Array<{
        partIndex: number;
        clipUrls: string[];
        totalMb: number;
    }>;
};
export declare function buildAssemblePlan(req: AssembleRequest): AssemblePlan;
