import { UserState } from './../../../types/user';
import { EntityUpdateTime, EntityCreateTime } from './../../../types/common';
// 创建用户表
import {
  Email,
  PassWord,
  Phone,
  UserId,
  UserName,
  Avator,
  UserRole,
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

  @Column({ select: false })
  password: PassWord;

  @Column({ length: 20 })
  email: Email;

  @Column({ length: 11, default: '' })
  phone: Phone;

  @Column({ default: DEFAULT_USER_AVATOR })
  avator: Avator;

  @Column({ type: 'tinyint', default: UserState.Normal })
  state: UserState;

  @Column({ default: UserRole.User }) // 默认是普通用户
  role: UserRole;

  @CreateDateColumn()
  createTime: EntityCreateTime;

  @UpdateDateColumn()
  updateTime: EntityUpdateTime;
}
