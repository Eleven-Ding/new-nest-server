import { PartialType } from '@nestjs/mapped-types';
import { UserEntity } from '../entity/user.entity';
import { IsNotEmpty } from 'class-validator';
import { Email } from 'src/types';

// TODO: 为什么IsNumber 不起作用
export class UpdateUserDto extends PartialType(UserEntity) {
  @IsNotEmpty()
  userId: number;
}
