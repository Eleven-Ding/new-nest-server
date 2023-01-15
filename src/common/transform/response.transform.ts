import { ElevenLoggerService } from './../../modules/logger/logger.service';
import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Injectable,
  Inject,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Request } from 'express';

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

export class ResponseTransformerInterceptor implements NestInterceptor {
  @Inject()
  logger: ElevenLoggerService;
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest() as Request;
    const pre = Date.now();
    return next.handle().pipe(
      map((response) => {
        this.logger.metric(request.url.split('?')[0], Date.now() - pre);
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
