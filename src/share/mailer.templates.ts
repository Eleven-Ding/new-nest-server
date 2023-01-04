import { VERIFY_CODE_EXP_TIME } from './constant';
// 模版 1 ，发送验证码
export const creatSendVerifyCodeTemplate = (code: string) => {
  return `
      <p>ElevenDing</p>
      <p>您正在注册账号，如果不是本人操作，请忽略</p>
      <p>您的验证码为: <span style="color:red">${code}</span></p>
      <p>验证码有效时间为 <span style="color: red">${VERIFY_CODE_EXP_TIME}</span> 分钟</p>
      `;
};
