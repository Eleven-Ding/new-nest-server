import { JwtConfig } from 'src/types/jwt';
import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtGuard } from './guard/jwt.guard';
import { APP_GUARD } from '@nestjs/core';
@Module({
  providers: [
    AuthService,
    LocalStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configServide: ConfigService) => {
        const { secret, expiresIn } = configServide.get('jwt') as JwtConfig;
        return {
          secret, // token 验证时用于解密的 secret
          signOptions: {
            expiresIn, // 过期时间
          },
        };
      },
    }),
  ],
})
export class AuthModule {}
