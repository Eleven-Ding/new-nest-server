import { Avator } from 'src/types';
// 用户默认头像
export const DEFAULT_USER_AVATOR: Avator =
  'https://blog-1303885568.cos.ap-chengdu.myqcloud.com/useImg/avat.jpg';

export const VERIFY_CODE_EXP_TIME = 3; // 发送的验证码 3 分钟内过期

export const DETAULT_CODE_COUNT = 4; // 随机生成验证码的位数

export const EMAIL_REGEX = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/; // 邮箱校验正则
