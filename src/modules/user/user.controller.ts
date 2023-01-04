import { AuthService } from './../auth/auth.service';
import { RegisterDto } from './dto/register.dto';
import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { LocalStrategyGuard } from '../auth/guard/local.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.userService.register(registerDto);
  }

  @Post('/login')
  @UseGuards(LocalStrategyGuard)
  async logIn(@Request() req) {
    return this.authService.logIn(req.user);
  }
}
