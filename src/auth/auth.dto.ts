import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class LoginInputDTO {
  @Field()
  @IsString()
  email!: string;

  @Field()
  @IsString()
  password!: string;
}

@ObjectType('LoginResponse')
export class LoginResponseDTO {
  @Field()
  accessToken!: string;
}