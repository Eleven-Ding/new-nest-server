import { createResponse } from 'src/common/transform/response.transform';
import { Injectable, Inject } from '@nestjs/common';
import { ElevenLoggerService } from './modules/logger/logger.service';

@Injectable()
export class AppService {
  @Inject()
  logger: ElevenLoggerService;

  getHello() {
    this.logger.log('这是一条 log 日志', {
      name: '测试咯',
    });
    this.logger.warn('这是一条 warn 日志', {
      name: '测试咯',
    });
    this.logger.error('这是一跳 error 日志', {
      name: '测试咯',
    });

    this.logger.debug('这是一条 debug 日志', {
      name: '测试咯',
    });

    this.logger.metric('get_time_success', 1);
    return createResponse({
      msg: 'Hello Nest',
    });
  }
}
