import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignalMessage {
  @Field()
  streamUuid!: string;

  @Field()
  toPeerId!: string;

  @Field()
  fromPeerId!: string;

  // JSON string payload: { type: 'offer'|'answer'|'ice', ... }
  @Field()
  payload!: string;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;
}



