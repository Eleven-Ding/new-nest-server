import { ConfigService } from '@nestjs/config';
import { createResponse } from 'src/common/transform/response.transform';
import { Email, PassWord, User } from 'src/types';
import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { encryption } from 'src/share/encryption';
import { JwtService } from '@nestjs/jwt';
import { JwtConfig } from 'src/types/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: Email, pwd: PassWord) {
    const user = await this.userService.findOne(email);
    if (user && (await encryption(pwd, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  //
  async logIn(payload: User) {
    // 签发 token
    return createResponse('登录成功', {
      access_token: this.jwtService.sign(payload, {
        privateKey: (this.configService.get('jwt') as JwtConfig).secret,
      }),
    });
  }
}
