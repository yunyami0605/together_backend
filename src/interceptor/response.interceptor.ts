import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    // response object 변경
    return next.handle().pipe(
      map((data) => {
        // console.log(data);

        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          // message: data.message,
          data,
        };
      }),
    );
  }
}
