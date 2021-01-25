import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from '../user/user.dto';
import { CurrentUser, ResGql } from './auth.interface';
import { AuthenticatedUser } from './auth.interface';
import { LoginInputDTO, LoginResponseDTO } from './auth.dto';
import { JwtAuthGuard } from './auth.guard';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UserEntity } from 'src/user/user.entity';
import { Response } from 'express';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponseDTO)
  async login(
    @Args('input') input: LoginInputDTO,
    @ResGql() res: Response,
  ): Promise<LoginResponseDTO> {
    const user = await this.authService.validateUser(
      input.email,
      input.password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    const response = await this.authService.login(user);

    const cookie = `Authentication=${response.accessToken}; HttpOnly; Path=/; Max-Age=280000`;
    res.setHeader('Set-Cookie', cookie);

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => UserDTO)
  me(@CurrentUser() user: AuthenticatedUser): Promise<UserEntity> {
    return this.authService.currentUser(user);
  }
}
