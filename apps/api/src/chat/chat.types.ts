import { Field, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ChatMessage {
  @Field(() => Int)
  id!: number;

  @Field(() => ID)
  uuid!: string;

  @Field(() => GraphQLISODateTime)
  create_date!: Date;

  @Field()
  anon_id!: string;

  @Field()
  anon_text_color!: string;

  @Field()
  anon_background_color!: string;

  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field()
  message!: string;

  @Field()
  removed!: boolean;

  @Field(() => Int)
  stream_id!: number;
}


