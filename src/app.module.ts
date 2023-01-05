import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { config } from './config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntity } from './modules/user/entity/user.entity';
import { SmtpModule } from './modules/smtp/smtp.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { CaslModule } from './modules/casl/casl.module';
import { APP_GUARD } from '@nestjs/core';
import { PoliciesGuard } from './modules/casl/police.guard';

@Module({
  imports: [
    UserModule,
    AuthModule,
    SmtpModule,
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.get('redis');
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          ...configService.get('typeorm'),
          entities: [UserEntity],
          charset: 'utf8mb4',
          timezone: '+08:00', //服务器上配置的时区
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
