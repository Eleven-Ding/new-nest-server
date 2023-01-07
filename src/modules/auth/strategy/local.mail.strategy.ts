import { Email } from 'src/types';
import { AuthService } from './../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalEmailAndCodeStrategy extends PassportStrategy(
  Strategy,
  'email',
) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordFiled: 'code',
    });
  }

  async validate(email: Email, code: string) {
    const user = await this.authService.validateUserWithEmailAndCode(
      email,
      code,
    );
    if (!user) {
      throw new UnauthorizedException('验证码错误，请重新输入');
    }
    return user;
  }
}
