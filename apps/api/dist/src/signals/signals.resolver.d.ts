import { SignalsService } from './signals.service';
export declare class SignalsResolver {
    private readonly signals;
    constructor(signals: SignalsService);
    sendSignal(streamUuid: string, toPeerId: string, fromPeerId: string, payload: string): Promise<boolean>;
    signalReceived(streamUuid: string, peerId: string): import("graphql-subscriptions/dist/pubsub-async-iterable-iterator").PubSubAsyncIterableIterator<unknown>;
}
