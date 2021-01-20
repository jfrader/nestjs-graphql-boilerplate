import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Module } from '@nestjs/common';
import { UserDto } from './user.dto';
import { UserEntity } from './user.entity';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      // import the NestjsQueryTypeOrmModule to register the entity with typeorm
      // and provide a QueryService
      imports: [NestjsQueryTypeOrmModule.forFeature([UserEntity])],
      // describe the resolvers you want to expose
      resolvers: [{ DTOClass: UserDto, EntityClass: UserEntity }],
    }),
  ],
})
export class UserModule {}