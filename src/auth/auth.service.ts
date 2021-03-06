import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectQueryService, QueryService } from '@nestjs-query/core';
import { UserEntity } from '../user/user.entity';
import { AuthenticatedUser, JwtPayload } from './auth.interface';
import { LoginResponseDTO } from './auth.dto';
import { UserDTO } from 'src/user/user.dto';
import { CryptoService } from 'src/crypto/crypto.service';
import { TranslatedResponseException } from 'src/response/response.exception';

@Injectable()
export class AuthService {
  constructor(
    @InjectQueryService(UserEntity)
    private usersService: QueryService<UserEntity>,
    private jwtService: JwtService,
    private cryptoService: CryptoService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<AuthenticatedUser | null> {
    const [user] = await this.usersService.query({
      filter: { email: { eq: email } },
      paging: { limit: 1 },
    });

    const hash = await this.cryptoService.sha256(pass);

    if (user && user.password === hash) {
      return user;
    }
    throw new TranslatedResponseException(
      'errors.AUTHENTICATION_FAILED',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async currentUser(authUser: AuthenticatedUser): Promise<UserDTO> {
    try {
      const user = await this.usersService.getById(authUser.id);
      return user;
    } catch (e) {
      throw new TranslatedResponseException(
        'errors.UNAUTHORIZED',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  login(user: AuthenticatedUser): Promise<LoginResponseDTO> {
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };
    return Promise.resolve({
      accessToken: this.jwtService.sign(payload),
    });
  }
}
