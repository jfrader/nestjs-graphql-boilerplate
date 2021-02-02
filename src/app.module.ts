import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { I18nJsonParser, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { HeaderResolver } from './app.header-resolver';
import { I18N_HEADER_KEY } from './app.constants';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'es',
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(__dirname, '/i18n/'),
      },
      resolvers: [new HeaderResolver([I18N_HEADER_KEY])],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: 'pablitoclavounclavito',
      username: 'root',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    GraphQLModule.forRoot({
      // set to true to automatically generate schema
      autoSchemaFile: './schema.graphql',
      cors: {
        credentials: true,
        origin: true,
      },
      context: ({
        req,
        connection,
      }: {
        req: { headers: Record<string, unknown> };
        connection: Record<string, unknown>;
      }) =>
        connection
          ? { ...(connection.context as Record<string, unknown>) }
          : { ...req },
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
