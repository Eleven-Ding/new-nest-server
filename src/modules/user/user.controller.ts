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
} from '@nestjs/common';
import { UserService } from './user.service';
import { LocalStrategyGuard } from '../auth/guard/local.guard';
import { isPublic } from 'src/common/decorates/isPublic';
import { Roles } from 'src/common/decorates/Roles';
import { UserRole } from 'src/types';
import { FindAllDto } from './dto/findAll.dto';
import { UpdateUserDto } from './dto/update.dto';
import { CheckPolicies, PoliciesGuard } from '../casl/police.guard';
import { updateUserPolicyHandler } from './police/update.police';

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

  // 更新用户数据
  @Post('update')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(updateUserPolicyHandler)
  async update(@Body() body: UpdateUserDto) {
    return this.userService.updateUser(body);
  }
}
