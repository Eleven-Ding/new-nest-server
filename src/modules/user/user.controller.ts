import { AuthService } from './../auth/auth.service';
import { RegisterDto } from './dto/register.dto';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Query,
  Put,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LocalStrategyGuard } from '../auth/guard/local.guard';
import { isPublic } from 'src/common/decorates/isPublic';
import { Roles } from 'src/common/decorates/Roles';
import { UserRole } from 'src/types';
import { FindAllDto } from './dto/findAll.dto';
import { UpdateUserDto } from './dto/update.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('register')
  @isPublic()
  async register(@Body() registerDto: RegisterDto) {
    return this.userService.register(registerDto);
  }

  @Post('/login')
  @isPublic()
  @UseGuards(LocalStrategyGuard)
  async logIn(@Request() req) {
    return this.authService.logIn(req.user);
  }

  @Get('/findAll')
  @Roles(UserRole.Admin)
  async findAll(@Query() query: FindAllDto) {
    return this.userService.findAll(query);
  }

  // 用户使用
  @Post('update')
  async updateSelf() {
    // CABL
    return 233;
  }

  // 管理员后台使用
  @Put('update')
  @Roles(UserRole.Admin)
  async update(@Body() body: UpdateUserDto) {
    throw new HttpException('233', 403);
    return '233';
  }
}
