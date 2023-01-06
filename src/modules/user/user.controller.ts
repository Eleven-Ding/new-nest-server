import { createResponse } from 'src/common/transform/response.transform';
import { Action } from 'src/modules/casl/casl-ability.factory';
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
} from '@nestjs/common';
import { UserService } from './user.service';
import { LocalStrategyGuard } from '../auth/guard/local.guard';
import { isPublic } from 'src/common/decorates/isPublic';
import { Roles } from 'src/common/decorates/Roles';
import { User, UserRole } from 'src/types';
import { FindAllDto } from './dto/findAll.dto';
import { UpdateUserDto } from './dto/update.dto';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { NoPermissionException } from 'src/common/exceptions/NoPermissionException';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
    private caslAbilityFactory: CaslAbilityFactory,
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

  // 分野获取数据
  @Get('/findAll')
  @Roles(UserRole.Admin)
  async findAll(@Query() query: FindAllDto) {
    return this.userService.findAll(query);
  }

  // 更新用户数据
  @Post('update')
  async update(@Body() body: UpdateUserDto, @Request() req) {
    const user = req.user as User;
    const ability = this.caslAbilityFactory.createForUser(user);
    const userWillUpdate = await this.userService.findOne(Number(body.userId));
    if (!userWillUpdate) {
      return createResponse('该用户不存在');
    }
    if (!ability.can(Action.Update, undefined)) {
      throw new NoPermissionException('您无权更新他人信息');
    }
    // 一些字段只有管理员能够更新，用户不能刚更新
    const {
      role,
      phone,
      state,
      email,
      createTime,
      updateTime,
      ...updateUserParam
    } = body;
    const canUpdateBody = user.role === UserRole.Admin ? body : updateUserParam;
    return this.userService.updateUser(canUpdateBody, userWillUpdate);
  }
}
