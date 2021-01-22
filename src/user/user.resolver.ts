import { QueryService, InjectQueryService } from '@nestjs-query/core';
import { CRUDResolver } from '@nestjs-query/query-graphql';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CreateUserInputDTO, UserDTO } from './user.dto';
import { UserEntity } from './user.entity';
import * as crypto from 'crypto';
import { CryptoService } from 'src/crypto/crypto.service';

@Resolver(() => UserDTO)
export class UserResolver {
  constructor(
    @InjectQueryService(UserEntity) readonly service: QueryService<UserEntity>,
    private cryptoService: CryptoService,
  ) {}

  // @UseGuards(JwtAuthGuard)
  @Mutation(() => UserDTO)
  async createUser(@Args('input') input: CreateUserInputDTO): Promise<UserDTO> {
    if (!input.email || !input.password) {
      throw new Error('Fields cannot be empty');
    }
    const hash = await this.cryptoService.sha256(input.password);

    const user = await this.service.createOne({
      email: input.email,
      password: hash,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
