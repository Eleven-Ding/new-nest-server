import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Injectable,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

export const createResponse = ({
  msg,
  code,
  data,
}: {
  msg?: string;
  code?: number;
  data?: any;
}) => {
  return {
    data,
    msg,
    code,
  };
};

@Injectable()
export class ResponseTransformerInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((response) => {
        const { msg = '请求成功', code = 0, data = {} } = response;
        return {
          code,
          data,
          msg,
        };
      }),
    );
  }
}
