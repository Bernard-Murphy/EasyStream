import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { SignalMessage } from './signal.types';
import { SignalsService } from './signals.service';
import { pubsub, TOPIC_SIGNAL_RECEIVED } from '../common/graphql-pubsub';

@Resolver(() => SignalMessage)
export class SignalsResolver {
  constructor(private readonly signals: SignalsService) {}

  @Mutation(() => Boolean)
  async sendSignal(
    @Args('streamUuid') streamUuid: string,
    @Args('toPeerId') toPeerId: string,
    @Args('fromPeerId') fromPeerId: string,
    @Args('payload') payload: string,
  ) {
    return await this.signals.sendSignal({ streamUuid, toPeerId, fromPeerId, payload });
  }

  @Subscription(() => SignalMessage, {
    filter: (payload, variables) =>
      payload.signalReceived.toPeerId === variables.peerId &&
      payload.signalReceived.streamUuid === variables.streamUuid,
  })
  signalReceived(@Args('streamUuid') streamUuid: string, @Args('peerId') peerId: string) {
    return pubsub.asyncIterableIterator(TOPIC_SIGNAL_RECEIVED);
  }
}



