import { Injectable, HttpException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { cryption } from 'src/share/encryption';

@Injectable()
export class UserService {
  @InjectRepository(UserEntity)
  userEntity: Repository<UserEntity>;

  async register(registerDto: RegisterDto) {
    // 1. 查询该邮箱是否存在
    const user = await this.userEntity.findOne({
      where: {
        email: registerDto.email,
      },
    });
    if (user) {
      throw new HttpException('该邮箱已被注册! 请重新输入', 401);
    }
    console.log(user);
    // 2. 密码加密
    const hashPassword = await cryption(registerDto.password);
    // 3. 存储

    try {
      await this.userEntity.save({ ...registerDto, password: hashPassword });
    } catch (error) {
      throw new HttpException((error as Error).message, 500);
    }
    return {
      msg: '注册成功',
    };
  }
}
