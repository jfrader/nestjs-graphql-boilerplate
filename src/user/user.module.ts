import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Module } from '@nestjs/common';
import { CryptoModule } from 'src/crypto/crypto.module';
import { UserEntity } from './user.entity';
import { UserResolver } from './user.resolver';

@Module({
  providers: [UserResolver],
  imports: [NestjsQueryTypeOrmModule.forFeature([UserEntity]), CryptoModule],
  exports: [NestjsQueryTypeOrmModule.forFeature([UserEntity])],
})
export class UserModule {}
