import { JwtConfig } from 'src/types/jwt';
import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Module({
  providers: [AuthService, LocalStrategy],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configServide: ConfigService) => {
        const { secret, expiresIn } = configServide.get('jwt') as JwtConfig;
        return {
          secret,
          signOptions: {
            expiresIn,
          },
        };
      },
    }),
  ],
})
export class AuthModule {}
