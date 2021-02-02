import { QueryService, InjectQueryService } from '@nestjs-query/core';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CreateUserInputDTO, UserDTO, UserResponseDTO } from './user.dto';
import { UserEntity } from './user.entity';
import { CryptoService } from 'src/crypto/crypto.service';
import { AllowedUserRoles } from 'src/auth/auth.interface';
import { EUserRole } from './user.interface';
import { UserRoleGuard } from './user.guard';
import { TranslatedResponseException } from 'src/response/response.exception';
import { I18nService } from 'nestjs-i18n';
import { ReadResolver } from '@nestjs-query/query-graphql';

@Resolver()
export class UserResolver extends ReadResolver(UserDTO, {
  guards: [JwtAuthGuard, UserRoleGuard],
  decorators: [AllowedUserRoles(EUserRole.ADMIN)],
}) {
  constructor(
    @InjectQueryService(UserEntity) readonly service: QueryService<UserEntity>,
    private cryptoService: CryptoService,
    private i18n: I18nService,
  ) {
    super(service);
  }

  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @AllowedUserRoles(EUserRole.ADMIN)
  @Mutation(() => UserResponseDTO)
  async createUser(
    @Args('input') input: CreateUserInputDTO,
  ): Promise<UserResponseDTO> {
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
        success: true,
        message: this.i18n.t('user.USER_CREATED'),
        node: user,
      };
    } catch (e) {
      console.error(e);
      throw new TranslatedResponseException();
    }
  }
}
