import { PassWord } from 'src/types';
import { UpdateUserOptType } from './../../../types/user';
import { PartialType } from '@nestjs/mapped-types';
import { UserEntity } from '../entity/user.entity';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class UpdateUserDto extends PartialType(UserEntity) {
  @IsNotEmpty()
  @IsPositive()
  readonly userId: number;

  @IsNotEmpty({
    message: '更新类型 opType 不能为空',
  })
  readonly opType: UpdateUserOptType;

  @IsOptional()
  readonly newPassword: PassWord;

  @IsOptional()
  readonly code: string;
}
