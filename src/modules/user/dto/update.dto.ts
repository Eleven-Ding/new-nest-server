import { PassWord } from 'src/types';
import { UpdateUserOptType } from './../../../types/user';
import { PartialType } from '@nestjs/mapped-types';
import { UserEntity } from '../entity/user.entity';
import { IsNotEmpty, IsOptional } from 'class-validator';

// TODO: 为什么IsNumber 不起作用
export class UpdateUserDto extends PartialType(UserEntity) {
  @IsNotEmpty()
  readonly userId: number;

  @IsNotEmpty({
    message: '更新类型 opType 不能为空',
  })
  readonly opType: UpdateUserOptType;

  @IsOptional()
  readonly newPassword: PassWord;
}
