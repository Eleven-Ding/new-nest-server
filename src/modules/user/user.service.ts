import { Injectable, HttpException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  @InjectRepository(UserEntity)
  userEntity: Repository<UserEntity>;

  async register(registerDto: RegisterDto) {
    // 1. 查询该邮箱是否存在
    const user = this.userEntity.findOne({
      where: {
        email: registerDto.email,
      },
    });
    if (user) {
      throw new HttpException('该邮箱已被注册! 请重新输入', 401);
    }
    // 2. 密码加密

    // 3. 存储
    return this.userEntity.save(registerDto);
  }
}