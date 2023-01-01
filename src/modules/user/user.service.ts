import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async register() {
    return 'register success';
  }
}
