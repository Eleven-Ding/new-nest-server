import { User } from './../../types/user';
import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import { ElevenLoggerService } from '../../modules/logger/logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  @Inject()
  logger: ElevenLoggerService;

  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();

    const request = context.getRequest() as Request;
    const response = context.getResponse();
    const { url, method } = request;
    const status = exception.status;
    const { response: exceptionResponse } = exception;
    const errorMsg =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : `${exceptionResponse?.error} -> ${exception.name} ${exceptionResponse?.message}`;
    const user = request.user as User;
    this.logger.warn('请求失败: ' + errorMsg, {
      url,
      status,
      method,
      userId: user?.userId,
    });
    this.logger.metric(url.split('?')[0] + '_failed', 1);
    response.status(status).json({
      code: -1, // 这里的 code 应该是自定义的
      data: {
        status,
        path: url,
        method,
      },
      errorMsg,
    });
  }
}
