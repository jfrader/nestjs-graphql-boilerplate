/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export interface IMutationResponseDTO<T> {
  node?: T;
  message: string;
  success: boolean;
}

export function MutationResponseDTO<T>(classRef: Type<T>): any {
  @ObjectType({ isAbstract: true })
  abstract class MutationResponseDTO {
    @Field((type) => classRef, { nullable: true })
    node?: T;

    @Field()
    message: string;

    @Field()
    success: boolean;
  }
  return MutationResponseDTO;
}

export function EmptyResponseDTO(): any {
  @ObjectType({ isAbstract: true })
  abstract class EmptyResponseDTO {
    @Field()
    message: string;

    @Field()
    success: boolean;
  }
  return EmptyResponseDTO;
}
