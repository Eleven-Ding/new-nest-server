import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { config } from './config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntity } from './modules/user/entity/user.entity';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
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
