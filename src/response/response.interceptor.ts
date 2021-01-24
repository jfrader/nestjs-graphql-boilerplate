import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MutationResponse } from './response.interface';

@Injectable()
export class MutationResponseInterceptor<T>
  implements NestInterceptor<T, MutationResponse<T>> {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<MutationResponse<T>> {
    return next.handle().pipe(
      // TODO: Handle errors with a logger in production
      catchError((err) => throwError(err)),
      map((data) => ({ ...data, success: true })),
    );
  }
}
