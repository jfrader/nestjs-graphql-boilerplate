import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export function ResponseDTO<T>(classRef: Type<T>): any {
  @ObjectType({ isAbstract: true })
  abstract class ResponseType {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Field((type) => classRef, { nullable: true })
    data: T;

    @Field()
    message: string;

    @Field()
    success: boolean;
  }
  return ResponseType;
}
