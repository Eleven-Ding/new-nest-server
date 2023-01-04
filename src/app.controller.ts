import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { Roles } from './common/decorates/Roles';
import { UserRole } from './types';
import { isPublic } from './common/decorates/isPublic';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @isPublic()
  // @Roles(UserRole.Admin)
  getHello() {
    return this.appService.getHello();
  }
}
