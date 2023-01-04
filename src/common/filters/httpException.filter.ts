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
    const errorMsg = exception.response || '请求出错';

    // TODO: 搞搞 errorMsg 合并 error + message
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
