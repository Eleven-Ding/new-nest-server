import { Avator } from 'src/types';

export const DEFAULT_USER_AVATOR: Avator =
  'https://blog-1303885568.cos.ap-chengdu.myqcloud.com/useImg/avat.jpg'; // 默认用户头像，后期可更改

export const VERIFY_CODE_EXP_TIME = 180; // 发送的验证码 3 分钟内过期

export const DETAULT_CODE_COUNT = 4; // 随机生成验证码的位数

export const EMAIL_REGEX = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/; // 邮箱校验正则

export const KMS_KEY_EXP_TIME = 300; // kms 密钥存储 5 分钟
