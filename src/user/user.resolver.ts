import { QueryService, InjectQueryService } from '@nestjs-query/core';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CreateUserInputDTO, ResponseUserDTO, UserDTO } from './user.dto';
import { UserEntity } from './user.entity';
import { CryptoService } from 'src/crypto/crypto.service';
import { AllowedUserRoles } from 'src/auth/auth.interface';
import { EUserRole } from './user.interface';
import { UserRoleGuard } from './user.guard';
import { TranslatedResponseException } from 'src/response/response.exception';

@Resolver(() => UserDTO)
export class UserResolver {
  constructor(
    @InjectQueryService(UserEntity) readonly service: QueryService<UserEntity>,
    private cryptoService: CryptoService,
  ) {}

  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @AllowedUserRoles(EUserRole.ADMIN)
  @Mutation(() => ResponseUserDTO)
  async createUser(
    @Args('input') input: CreateUserInputDTO,
  ): Promise<ResponseUserDTO> {
    if (!input.email || !input.password) {
      throw new TranslatedResponseException(
        'errors.NO_EMPTY_FIELDS',
        HttpStatus.BAD_REQUEST,
      );
    }

    const exists = await this.service.query({
      filter: { email: { eq: input.email } },
      paging: { limit: 1 },
    });

    if (exists.length) {
      throw new TranslatedResponseException(
        'errors.EMAIL_ALREADY_USED',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const hash = await this.cryptoService.sha256(input.password);
      const user = await this.service.createOne({
        email: input.email,
        password: hash,
        role: EUserRole.USER,
      });

      if (!user) {
        throw new TranslatedResponseException();
      }

      return {
        message: 'Usuario creado correctamente',
        data: user,
      };
    } catch (e) {
      console.error(e);
      throw new TranslatedResponseException();
    }
  }
}
