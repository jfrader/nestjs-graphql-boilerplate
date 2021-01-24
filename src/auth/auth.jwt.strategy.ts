import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthenticatedUser, JwtPayload } from './auth.interface';
import { AUTH_SECRET } from './auth.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AUTH_SECRET,
    });
  }

  validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    return Promise.resolve({
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    });
  }
}
