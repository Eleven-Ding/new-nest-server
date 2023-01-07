import { UpdateUserOptType, User, UserRole } from './../../types';
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
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LocalStrategyGuard } from '../auth/guard/local.guard';
import { isPublic } from 'src/common/decorates/isPublic';
import { Roles } from 'src/common/decorates/Roles';
import { FindAllDto } from './dto/findAll.dto';
import { UpdateUserDto } from './dto/update.dto';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { NoPermissionException } from 'src/common/exceptions/NoPermissionException';
import { LoginEmailGuard } from '../auth/guard/local.email.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Post('/register')
  @isPublic()
  async register(@Body() registerDto: RegisterDto) {
    return this.userService.register(registerDto);
  }

  // 邮箱 + 密码登录
  @Post('/login')
  @isPublic()
  @UseGuards(LocalStrategyGuard)
  async logIn(@Request() req) {
    return this.authService.logIn(req.user);
  }

  // 邮箱 + 验证码登录，不一定有人一直都记得密码，所以新增这种邮箱 + 验证码登录的形式
  @Post('/loginWithEmail')
  @isPublic()
  @UseGuards(LoginEmailGuard)
  async logInWithEmail(@Request() req) {
    return this.authService.logIn(req.user);
  }

  // 分页获取用户数据
  @Post('/all')
  @Roles(UserRole.Admin)
  async findAll(@Body() body: FindAllDto) {
    return this.userService.findAll(body);
  }

  // 更新用户数据, 包括更新密码，通过opType来判断
  @Post('update')
  async update(@Body() body: UpdateUserDto, @Request() req) {
    const user = req.user as User;
    const ability = this.caslAbilityFactory.createForUser(user);
    const userWillUpdate = await this.userService.findOne(body.userId);
    if (!userWillUpdate) {
      return createResponse({
        msg: '该用户不存在',
      });
    }
    if (!ability.can(Action.Update, userWillUpdate)) {
      throw new NoPermissionException('您无权完成该操作');
    }
    const { opType, code, ...info4UpdateUser } = body;
    const {
      role,
      phone,
      state,
      email,
      createTime,
      updateTime,
      newPassword,
      password: oldPassword,
      ...otherUserInfo
    } = info4UpdateUser;
    switch (opType) {
      case UpdateUserOptType.Normal:
        const canUpdateBody =
          user.role === UserRole.Admin ? body : otherUserInfo;
        return this.userService.updateUser(canUpdateBody, userWillUpdate);
      case UpdateUserOptType.Password:
        return this.userService.updatePassword({
          userWillUpdate,
          oldPassword,
          newPassword,
        });
      case UpdateUserOptType.RetrievePassword:
        return this.userService.retrievePassword({
          userWillUpdate,
          code,
          newPassword,
        });
      default:
        throw new HttpException('操作类型不存在', 401);
    }
  }
}
