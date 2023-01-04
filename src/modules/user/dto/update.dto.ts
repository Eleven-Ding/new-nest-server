import { PartialType } from '@nestjs/mapped-types';
import { UserEntity } from '../entity/user.entity';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends PartialType(UserEntity) {
  @IsNotEmpty()
  userId: number;
}
