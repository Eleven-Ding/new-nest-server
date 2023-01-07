import { Email, PassWord } from 'src/types';
import { AuthService } from './../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: Email, password: PassWord) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('密码错误，请重新输入!');
    }
    return user;
  }
}
