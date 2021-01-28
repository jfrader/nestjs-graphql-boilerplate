import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from '../user/user.dto';
import { CurrentUser, ResGql } from './auth.interface';
import { AuthenticatedUser } from './auth.interface';
import { LoginInputDTO, LoginResponseDTO, LogoutResponseDTO } from './auth.dto';
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
    const node = await this.authService.login(user);

    const cookie = `Authentication=${node.accessToken}; HttpOnly; Path=/`;
    res.setHeader('Set-Cookie', cookie);

    return { success: true, message: 'You have been logged in!', node };
  }

  @Mutation(() => LogoutResponseDTO)
  async logout(@ResGql() res: Response): Promise<LogoutResponseDTO> {
    const cookie = `Authentication=; HttpOnly; Path=/`;
    res.setHeader('Set-Cookie', cookie);
    return { success: true, message: 'You have been logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => UserDTO)
  me(@CurrentUser() user: AuthenticatedUser): Promise<UserEntity> {
    return this.authService.currentUser(user);
  }
}
