export declare class SignalsService {
    sendSignal(input: {
        streamUuid: string;
        toPeerId: string;
        fromPeerId: string;
        payload: string;
    }): Promise<boolean>;
}
