import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();

    const request = context.getRequest();
    const response = context.getResponse();
    const { url, method } = request;
    const status = exception.status;
    const { response: exceptionResponse } = exception;
    const errorMsg =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : `${exceptionResponse?.error} -> ${exception.name} ${exceptionResponse?.message}`;

    response.status(status).json({
      code: -1, // 这里的 code 应该是自定义的
      data: {
        status: status,
        path: url,
        method,
      },
      errorMsg,
    });
  }
}
