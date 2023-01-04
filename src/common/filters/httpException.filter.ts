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
    const msg = exception.response || '请求出错';

    response.status(status).json({
      status: status,
      msg,
      path: url,
      method,
      timestamp: new Date().toISOString(),
    });
  }
}
