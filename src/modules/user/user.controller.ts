import { AuthService } from './../auth/auth.service';
import { RegisterDto } from './dto/register.dto';
import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { LocalStrategyGuard } from '../auth/guard/local.guard';
import { isPublic } from 'src/common/decorates/isPublic';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('register')
  @isPublic()
  async register(@Body() registerDto: RegisterDto) {
    return this.userService.register(registerDto);
  }

  @Post('/login')
  @isPublic()
  @UseGuards(LocalStrategyGuard)
  async logIn(@Request() req) {
    return this.authService.logIn(req.user);
  }
}
