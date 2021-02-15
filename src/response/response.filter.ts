import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import { I18nService } from 'nestjs-i18n';
import { I18N_DEFAULT_LANG, I18N_HEADER_KEY } from 'src/app.constants';
import { TranslatedResponseException } from './response.exception';

@Catch(TranslatedResponseException)
export class ResponseExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}
  async catch(e: TranslatedResponseException, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const context = gqlHost.getContext();
    console.log(context.req.headers[I18N_HEADER_KEY]);
    const lang = context.req.headers[I18N_HEADER_KEY] || I18N_DEFAULT_LANG;
    const options = { lang };
    if (e instanceof TranslatedResponseException) {
      throw new ApolloError(
        await this.i18n.translate(e.message, options),
        e.getStatus().toString(),
      );
    }
    throw new ApolloError(
      await this.i18n.translate('errors.SERVER_INTERNAL_ERROR'),
      HttpStatus.INTERNAL_SERVER_ERROR.toString(),
    );
  }
}
