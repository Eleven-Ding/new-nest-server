import { RegisterDto } from './dto/register.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    // 1. 短信校验服务

    // 2. 注册服务
    return this.userService.register(registerDto);
  }
}
