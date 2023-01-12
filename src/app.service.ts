import { ElevenLoggerService } from './modules/logger/logger.service';
import { createResponse } from 'src/common/transform/response.transform';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private logger: ElevenLoggerService) {
    this.logger.setContextName('AppService');
  }

  getHello() {
    this.logger.log('321');
    this.logger.warn('哈哈哈哈');
    this.logger.error('32发生错误1');
    this.logger.debug('这是一个Debug');
    return createResponse({
      msg: 'Hello Nest',
    });
  }
}
