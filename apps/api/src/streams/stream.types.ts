import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

export enum StreamStatus {
  live = 'live',
  processing = 'processing',
  past = 'past',
}

registerEnumType(StreamStatus, { name: 'StreamStatus' });

@ObjectType()
export class Stream {
  @Field(() => Int)
  id!: number;

  @Field(() => ID)
  uuid!: string;

  @Field(() => GraphQLISODateTime)
  start_time!: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  end_time?: Date | null;

  @Field()
  anon_id!: string;

  @Field()
  anon_text_color!: string;

  @Field()
  anon_background_color!: string;

  @Field()
  title!: string;

  @Field()
  description!: string;

  @Field(() => StreamStatus)
  status!: StreamStatus;

  @Field()
  removed!: boolean;

  @Field(() => [String])
  fileUrls!: string[];

  @Field(() => String, { nullable: true })
  thumbnailUrl?: string | null;
}


