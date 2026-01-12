import { Injectable } from '@nestjs/common';
import { pubsub, TOPIC_SIGNAL_RECEIVED } from '../common/graphql-pubsub';

@Injectable()
export class SignalsService {
  async sendSignal(input: {
    streamUuid: string;
    toPeerId: string;
    fromPeerId: string;
    payload: string;
  }) {
    const msg = {
      ...input,
      createdAt: new Date(),
    };
    await pubsub.publish(TOPIC_SIGNAL_RECEIVED, { signalReceived: msg });
    return true;
  }
}



