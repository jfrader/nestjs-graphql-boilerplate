import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('MutationResponse')
export class MutationResponseDTO {
  @Field()
  success!: boolean;
}
