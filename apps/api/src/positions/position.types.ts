import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StreamPosition {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  stream_id!: number;

  @Field(() => Int)
  stage!: number;

  @Field()
  peer_id!: string;

  @Field(() => [String])
  parents!: string[];

  @Field(() => [String])
  children!: string[];
}


