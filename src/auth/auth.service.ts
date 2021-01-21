import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectQueryService, QueryService } from '@nestjs-query/core';
import { UserEntity } from '../user/user.entity';
import { AuthenticatedUser, JwtPayload } from './auth.interface';
import { LoginResponseDTO } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectQueryService(UserEntity) private usersService: QueryService<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<AuthenticatedUser | null> {
    const [user] = await this.usersService.query({ filter: { email: { eq: email } }, paging: { limit: 1 } });
    // dont use plain text passwords in production!
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async currentUser(authUser: AuthenticatedUser): Promise<UserEntity> {
    try {
      const user = await this.usersService.getById(authUser.id);
      return user;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  login(user: AuthenticatedUser): Promise<LoginResponseDTO> {
    const payload: JwtPayload = { email: user.email, sub: user.id };
    return Promise.resolve({
      accessToken: this.jwtService.sign(payload),
    });
  }
}