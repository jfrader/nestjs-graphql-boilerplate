import { FilterableField } from '@nestjs-query/query-graphql';
import { ObjectType, GraphQLISODateTime, Int } from '@nestjs/graphql';

@ObjectType('User')
export class UserDTO {
  @FilterableField(() => Int)
  id!: number;

  @FilterableField()
  email!: string;

  @FilterableField()
  password!: string;

  @FilterableField(() => GraphQLISODateTime)
  created!: Date;

  @FilterableField(() => GraphQLISODateTime)
  updated!: Date;
}
