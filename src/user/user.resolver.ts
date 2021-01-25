import { QueryService, InjectQueryService } from '@nestjs-query/core';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CreateUserInputDTO, UserDTO } from './user.dto';
import { UserEntity } from './user.entity';
import { CryptoService } from 'src/crypto/crypto.service';
import { AllowedUserRoles } from 'src/auth/auth.interface';
import { EUserRole } from './user.interface';
import { UserRoleGuard } from './user.guard';

@Resolver(() => UserDTO)
export class UserResolver {
  constructor(
    @InjectQueryService(UserEntity) readonly service: QueryService<UserEntity>,
    private cryptoService: CryptoService,
  ) {}

  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @AllowedUserRoles(EUserRole.ADMIN)
  @Mutation(() => UserDTO)
  async createUser(@Args('input') input: CreateUserInputDTO): Promise<UserDTO> {
    if (!input.email || !input.password) {
      throw new BadRequestException('Fields cannot be empty');
    }

    const exists = await this.service.query({
      filter: { email: { eq: input.email } },
      paging: { limit: 1 },
    });

    if (exists.length) {
      throw new BadRequestException('Email already in use!');
    }

    try {
      const hash = await this.cryptoService.sha256(input.password);
      const user = await this.service.createOne({
        email: input.email,
        password: hash,
        role: EUserRole.USER,
      });

      if (!user) {
        throw new Error('Error inesperado');
      }

      return user;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
