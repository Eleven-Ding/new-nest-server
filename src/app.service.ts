import { MyLoggerService } from './modules/logger/logger.service';
import { createResponse } from 'src/common/transform/response.transform';
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class AppService {
  @Inject()
  logger: MyLoggerService;

  getHello() {
    this.logger.log('321', 'AppService');
    return createResponse({
      msg: 'Hello Nest',
    });
  }
}
