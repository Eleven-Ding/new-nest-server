import { createResponse } from 'src/common/transform/response.transform';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return createResponse('Hello Nest');
  }
}
