import { ExceptionFilter, Catch, UnauthorizedException } from '@nestjs/common';
import { ApolloError } from 'apollo-server-express';

@Catch(UnauthorizedException)
export class ResponseExceptionFilter implements ExceptionFilter {
  catch() {
    throw new ApolloError(
      'Usted no está autorizado, por favor inicie sesión.',
      'UNAUTHENTICATED',
    );
  }
}
