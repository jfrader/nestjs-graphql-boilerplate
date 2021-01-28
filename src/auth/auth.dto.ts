import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import {
  EmptyResponseDTO,
  MutationResponseDTO,
} from 'src/response/response.dto';

@InputType()
export class LoginInputDTO {
  @Field()
  @IsString()
  email!: string;

  @Field()
  @IsString()
  password!: string;
}

@ObjectType('Login')
class LoginDTO {
  @Field()
  accessToken!: string;
}

@ObjectType('LoginResponse')
export class LoginResponseDTO extends MutationResponseDTO(LoginDTO) {}

@ObjectType('LogoutResponse')
export class LogoutResponseDTO extends EmptyResponseDTO() {}
