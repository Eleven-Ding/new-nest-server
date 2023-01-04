import { JwtConfig } from 'src/types/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from './../../user/user.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { User } from 'src/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStratege extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {
    const secret = 'elevendingshiyi';
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // TODO: 这里自己做鉴权，不使用自动鉴权，
      // secretOrKey: (configService.get('jwt') as JwtConfig).secret,
      secretOrKey: secret,
    });
  }

  async validate(payload: User) {
    const { userId, email } = payload;
    const user = await this.userService.findOne(email);
    if (user && user.userId === userId) {
      return user;
    }
    return null;
  }
}
