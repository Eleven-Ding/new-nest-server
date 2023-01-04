import { EntityCreateTime, EntityUpdateTime } from './common';
export type UserName = string; // 用户名

export type PassWord = string; // 密码

export type Email = string; // 邮箱

export type Phone = string; // 手机号

export type UserId = number; // 用户Id

export type Avator = string; // 用户头像

export enum UserState {
  Normal,
  Band,
}

export type Band = boolean; // 用户活动开关

export enum UserRole { // 用户角色
  User,
  Admin,
}

// User 类型
export type User = {
  userId: UserId;
  username: UserName;
  email: Email;
  password?: PassWord;
  role?: UserRole;
  state?: UserState;
  phone?: Phone;
  avator?: Avator;
  createTime?: EntityCreateTime;
  updateTime?: EntityUpdateTime;
};
