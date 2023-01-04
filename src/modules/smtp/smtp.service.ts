import { createResponse } from 'src/common/transform/response.transform';
import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { creatSendVerifyCodeTemplate } from 'src/share/mailer.templates';
import { randomCode } from 'src/share/utils';
import { Email } from 'src/types';
import { SendCodeDto } from './dto/sendCode.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');

@Injectable()
export class SmtpService {
  constructor(private configService: ConfigService) {}

  async sendCode({ email }: SendCodeDto) {
    const code = randomCode();
    try {
      await this.sendMail(
        [email],
        creatSendVerifyCodeTemplate(code),
        '验证码，请查收',
      );
      // 缓存 code
      return createResponse('验证码发送成功，请注意查收');
    } catch (error) {
      throw new HttpException(
        `验证码发送失败，请练习管理员或者稍后重试, 这是你可以看的错误信息 ${
          (error as Error).message
        }`,
        500,
      );
    }
  }

  sendMail(emails: Email[], template: string, subject: string) {
    return new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport({
        service: 'qq',
        port: 465,
        secureConnection: true,
        auth: this.configService.get('smtp'),
      });
      const mailOptions = {
        from: 'ElevenDing <1559298665@qq.com>', // 发件地址
        to: emails, // 收件列表
        subject: subject, // 标题
        html: template,
      };

      transporter.sendMail(mailOptions, function (error: Error) {
        if (error) {
          reject(error);
          console.log(error);
        }
        resolve('');
        transporter.close(); // 如果没用，关闭连接池
      });
    });
  }
}
