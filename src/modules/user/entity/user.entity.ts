import { Band } from './../../../types/user';
import { EntityUpdateTime, EntityCreateTime } from './../../../types/common';
// 创建用户表
import {
  Email,
  PassWord,
  Phone,
  Salt,
  UserId,
  UserName,
  Avator,
} from 'src/types';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { DEFAULT_USER_AVATOR } from 'src/share/constant';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  userId: UserId;

  @Column({ length: 20 })
  username: UserName;

  @Column({ length: 20, select: false })
  password: PassWord;

  @Column({ length: 20 })
  email: Email;

  @Column({ length: 11 })
  phone: Phone;

  @Column({ length: 8, select: false })
  salt: Salt;

  @Column({ default: DEFAULT_USER_AVATOR })
  avator: Avator;

  @Column({ type: 'boolean', default: false })
  isBand: Band;

  @CreateDateColumn()
  createTime: EntityCreateTime;

  @UpdateDateColumn()
  updateTime: EntityUpdateTime;
}
