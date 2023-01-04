import { JwtService } from '@nestjs/jwt';
import { AuthService } from './../auth/auth.service';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { SmtpService } from '../smtp/smtp.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, SmtpService, AuthService, JwtService],
  exports: [UserService],
})
export class UserModule {}
