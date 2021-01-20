import { FilterableField } from '@nestjs-query/query-graphql';
import { ObjectType, GraphQLISODateTime, Field, Int } from '@nestjs/graphql';

@ObjectType('User')
export class UserDto {
  @FilterableField(() => Int)
  id!: number;

  @FilterableField()
  email!: string;

  @FilterableField()
  password!: string;

  @Field(() => GraphQLISODateTime)
  created!: Date;

  @Field(() => GraphQLISODateTime)
  updated!: Date;
}
