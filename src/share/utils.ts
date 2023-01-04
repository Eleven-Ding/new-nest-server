import { DETAULT_CODE_COUNT } from './constant';

// 生成 n 位随机数字字符串
export const randomCode = (length: number = DETAULT_CODE_COUNT) => {
  let code = '';
  for (let count = 0; count < length; count++) {
    code += parseInt(Math.random() * 10 + '');
  }
  return code;
};
