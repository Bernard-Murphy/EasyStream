import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { ChatMessage } from './chat.types';
import { pubsub, TOPIC_CHAT_MESSAGE_ADDED, TOPIC_CHAT_MESSAGE_UPDATED } from '../common/graphql-pubsub';
import { Field, ObjectType } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlJwtGuard } from '../auth/gql-jwt.guard';

@ObjectType()
class ChatMessageAddedPayload {
  @Field()
  streamUuid!: string;

  @Field(() => ChatMessage)
  message!: ChatMessage;
}

@ObjectType()
class ChatMessageUpdatedPayload {
  @Field()
  streamUuid!: string;

  @Field(() => ChatMessage)
  message!: ChatMessage;
}

@Resolver(() => ChatMessage)
export class ChatResolver {
  constructor(private readonly chat: ChatService) {}

  @Query(() => [ChatMessage])
  async chatMessages(@Args('streamUuid') streamUuid: string) {
    return await this.chat.listMessages(streamUuid);
  }

  @Mutation(() => ChatMessage)
  async sendChatMessage(
    @Args('streamUuid') streamUuid: string,
    @Args('message') message: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('anon_id', { nullable: true }) anon_id?: string,
    @Args('anon_text_color', { nullable: true }) anon_text_color?: string,
    @Args('anon_background_color', { nullable: true }) anon_background_color?: string,
  ) {
    const anon =
      anon_id && anon_text_color && anon_background_color
        ? { anon_id, anon_text_color, anon_background_color }
        : undefined;
    return await this.chat.sendMessage({
      streamUuid,
      message,
      name: name ?? null,
      anon,
    });
  }

  @Mutation(() => ChatMessage)
  @UseGuards(GqlJwtGuard)
  async removeChatMessage(@Args('uuid') uuid: string) {
    return await this.chat.removeMessage(uuid);
  }

  @Subscription(() => ChatMessageAddedPayload, {
    filter: (payload, variables) => payload.chatMessageAdded.streamUuid === variables.streamUuid,
  })
  chatMessageAdded(@Args('streamUuid') streamUuid: string) {
    return pubsub.asyncIterableIterator(TOPIC_CHAT_MESSAGE_ADDED);
  }

  @Subscription(() => ChatMessageUpdatedPayload, {
    filter: (payload, variables) =>
      payload.chatMessageUpdated.streamUuid === variables.streamUuid,
  })
  chatMessageUpdated(@Args('streamUuid') streamUuid: string) {
    return pubsub.asyncIterableIterator(TOPIC_CHAT_MESSAGE_UPDATED);
  }
}


