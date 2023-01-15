import { KmsEntity } from './modules/kms/entity/kms.entity';
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
import { CustomLogEntity } from './modules/logger/entity/customLog.entity';
import { MetricEntity } from './modules/logger/entity/metric.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from './modules/logger/logger.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseTransformerInterceptor } from './common/transform/response.transform';
import { HttpExceptionFilter } from './common/filters/httpException.filter';

@Module({
  imports: [
    UserModule,
    AuthModule,
    SmtpModule,
    LoggerModule,
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
          entities: [UserEntity, KmsEntity, CustomLogEntity, MetricEntity],
          charset: 'utf8mb4',
          timezone: '+08:00', //服务器上配置的时区
        };
      },
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
