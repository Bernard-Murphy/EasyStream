import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { StreamsService } from './streams.service';
import { Stream } from './stream.types';
import { pubsub, TOPIC_HIERARCHY_UPDATED, TOPIC_STREAM_UPDATED } from '../common/graphql-pubsub';
import { StreamPosition } from '../positions/position.types';
import { Field, ObjectType } from '@nestjs/graphql';
import { ProcessingService } from '../processing/processing.service';
import { UseGuards } from '@nestjs/common';
import { GqlJwtGuard } from '../auth/gql-jwt.guard';

@ObjectType()
class HierarchyUpdate {
  @Field()
  streamUuid!: string;

  @Field(() => [StreamPosition])
  positions!: StreamPosition[];
}

@Resolver(() => Stream)
export class StreamsResolver {
  constructor(
    private readonly streams: StreamsService,
    private readonly processing: ProcessingService,
  ) {}

  @Query(() => Stream)
  async stream(@Args('uuid') uuid: string) {
    return await this.streams.getByUuid(uuid);
  }

  @Query(() => [Stream])
  async liveStreams(
    @Args('sort', { nullable: true }) sort?: 'viewers' | 'recent',
    @Args('search', { nullable: true }) search?: string,
  ) {
    return await this.streams.listLive(sort ?? 'viewers', search);
  }

  @Query(() => [Stream])
  async pastStreams(@Args('search', { nullable: true }) search?: string) {
    return await this.streams.listPast('recent', search);
  }

  @Mutation(() => Stream)
  async createStream(
    @Args('title') title: string,
    @Args('description') description: string,
    @Args('thumbnailUrl', { nullable: true }) thumbnailUrl?: string,
    @Args('anon_id', { nullable: true }) anon_id?: string,
    @Args('anon_text_color', { nullable: true }) anon_text_color?: string,
    @Args('anon_background_color', { nullable: true }) anon_background_color?: string,
  ) {
    const anon =
      anon_id && anon_text_color && anon_background_color
        ? { anon_id, anon_text_color, anon_background_color }
        : undefined;
    return await this.streams.createStream({ title, description, thumbnailUrl, anon });
  }

  @Mutation(() => Boolean)
  async joinStream(@Args('uuid') uuid: string, @Args('peerId') peerId: string) {
    await this.streams.joinStream(uuid, peerId);
    return true;
  }

  @Mutation(() => Boolean)
  async leaveStream(@Args('uuid') uuid: string, @Args('peerId') peerId: string) {
    return await this.streams.leaveStream(uuid, peerId);
  }

  @Query(() => [StreamPosition])
  async streamPositions(@Args('uuid') uuid: string) {
    return await this.streams.getPositions(uuid);
  }

  // NOTE: auth guard will be added later; for now it's open to unblock UI wiring.
  @Mutation(() => Stream)
  @UseGuards(GqlJwtGuard)
  async endStream(@Args('uuid') uuid: string) {
    const updated = await this.streams.endStream(uuid);
    // fire-and-forget processing
    this.processing
      .processStreamToPast(uuid)
      .catch(() => {
        // keep stream in processing if it fails; error handling can be added later
      });
    return updated;
  }

  @Mutation(() => Stream)
  @UseGuards(GqlJwtGuard)
  async markPast(
    @Args('uuid') uuid: string,
    @Args('fileUrls', { type: () => [String] }) fileUrls: string[],
  ) {
    return await this.streams.markPast(uuid, fileUrls);
  }

  @Mutation(() => Stream)
  async setStreamThumbnail(
    @Args('uuid') uuid: string,
    @Args('thumbnailUrl', { nullable: true }) thumbnailUrl?: string,
  ) {
    return await this.streams.setThumbnail(uuid, thumbnailUrl ?? null);
  }

  @Subscription(() => Stream, {
    filter: (payload, variables) => payload.streamUpdated.uuid === variables.uuid,
  })
  streamUpdated(@Args('uuid') uuid: string) {
    return pubsub.asyncIterableIterator(TOPIC_STREAM_UPDATED);
  }

  @Subscription(() => HierarchyUpdate, {
    filter: (payload, variables) => payload.hierarchyUpdated.streamUuid === variables.uuid,
  })
  hierarchyUpdated(@Args('uuid') uuid: string) {
    return pubsub.asyncIterableIterator(TOPIC_HIERARCHY_UPDATED);
  }
}


