import { FilterableField } from '@nestjs-query/query-graphql';
import {
  ObjectType,
  GraphQLISODateTime,
  Int,
  Field,
  InputType,
} from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ObjectType('User')
export class UserDTO {
  @FilterableField(() => Int)
  id!: string;

  @FilterableField()
  email!: string;

  @FilterableField()
  password!: string;

  @FilterableField(() => GraphQLISODateTime)
  created!: Date;

  @FilterableField(() => GraphQLISODateTime)
  updated!: Date;
}

@InputType()
export class CreateUserInputDTO {
  @Field()
  @IsString()
  email!: string;

  @Field()
  @IsString()
  password!: string;
}
