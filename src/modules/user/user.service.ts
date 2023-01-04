import { FindAllDto } from './dto/findAll.dto';
import { Email } from 'src/types';
import { SmtpService } from './../smtp/smtp.service';
import {
  Injectable,
  HttpException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { cryption } from 'src/share/encryption';
import { createResponse } from 'src/common/transform/response.transform';

@Injectable()
export class UserService {
  @InjectRepository(UserEntity)
  userEntity: Repository<UserEntity>;

  constructor(private smtpService: SmtpService) {}

  async register(registerDto: RegisterDto) {
    try {
      // 1. 校验 email 和 code
      if (
        !(await this.smtpService.verifyCode4Email(
          registerDto.email,
          registerDto.code,
        ))
      ) {
        return createResponse('验证码校验错误');
      }

      // 2. 查询该邮箱是否存在
      const user = await this.userEntity.findOne({
        where: {
          email: registerDto.email,
        },
      });
      if (user) {
        throw new HttpException('该邮箱已被注册! 请重新输入', 401);
      }

      // 3. 密码加密
      const hashPassword = await cryption(registerDto.password);

      // 4. 存储
      await this.userEntity.save({ ...registerDto, password: hashPassword });
    } catch (error) {
      throw new HttpException(
        `注册失败 errorMsg=${(error as Error).message}`,
        400,
      );
    }
    return createResponse('用户注册成功');
  }

  async findOne(email: Email) {
    const user = await this.userEntity.findOne({
      where: {
        email,
      },
      select: ['password', 'email', 'userId', 'role'],
    });
    if (!user) {
      throw new NotFoundException(`邮箱为[${email}]的用户不存在,`);
    }
    return user;
  }

  async findAll(params: FindAllDto) {
    try {
      const { limit, offset } = params;
      const [list, count] = await this.userEntity.findAndCount({
        skip: offset * limit,
        take: limit,
      });
      return createResponse('获取分页用户成功', {
        list,
        count,
      });
    } catch (error) {
      throw new InternalServerErrorException(error, '获取用户分页失败');
    }
  }

  async updateUser() {
    throw new HttpException('233', 403);
  }
}
