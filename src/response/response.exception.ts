import { HttpException, HttpStatus } from '@nestjs/common';

export class TranslatedResponseException extends HttpException {
  constructor(
    i18nKey = 'errors.SERVER_INTERNAL_ERROR',
    status = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(i18nKey, status);
  }
}
