import { EntityCreateTime, EntityUpdateTime } from './common';
export type UserName = string; // 用户名

export type PassWord = string; // 密码

export type Email = string; // 邮箱

export type Phone = string; // 手机号

export type UserId = number; // 用户Id

export type Avator = string; // 用户头像

export enum UserState { // 用户状态
  Normal, // 正常
  Band, // 封禁
  Delete, // 注销、删除
}

// 更新用户信息时的操作类型
export enum UpdateUserOptType {
  Normal, // 更新除开 password，email，phone 之外的数据
  Password, // 更新密码
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
