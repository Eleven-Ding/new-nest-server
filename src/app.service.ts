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

    return createResponse({
      msg: 'Hello Nest',
    });
  }
}
