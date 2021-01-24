import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './auth.jwt.strategy';
import { AuthResolver } from './auth.resolver';
import { CryptoModule } from 'src/crypto/crypto.module';
import { AUTH_SECRET } from './auth.constants';

@Module({
  imports: [
    CryptoModule,
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: AUTH_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
