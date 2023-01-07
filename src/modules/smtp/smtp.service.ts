import { createResponse } from 'src/common/transform/response.transform';
import { ConfigService } from '@nestjs/config';
import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
import { creatSendVerifyCodeTemplate } from 'src/share/mailer.templates';
import { randomCode } from 'src/share/utils';
import { Email } from 'src/types';
import { SendCodeDto } from './dto/sendCode.dto';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { VERIFY_CODE_EXP_TIME } from 'src/share/constant';
import { KmsService } from '../kms/kms.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');

@Injectable()
export class SmtpService {
  constructor(
    private configService: ConfigService,
    private kmsService: KmsService,
    @InjectRedis() private readonly redis: Redis,
  ) {
    this.redis.get('1964845235@qq.com').then((res) => {
      console.log(res);
    });
  }

  // 发送验证码
  async sendCode({ email }: SendCodeDto) {
    const code = randomCode();
    try {
      await this.sendMail(
        [email],
        creatSendVerifyCodeTemplate(code),
        '验证码，请查收',
      );
      // 缓存 code
      await this.redis.set(email, code, 'EX', VERIFY_CODE_EXP_TIME);
      return createResponse({
        msg: '验证码发送成功，请注意查收',
      });
    } catch (error) {
      throw new HttpException(
        `验证码发送失败，请练习管理员或者稍后重试, 这是你可以看的错误信息 ${
          (error as Error).message
        }`,
        500,
      );
    }
  }
  // 校验验证码
  async verifyCode4Email(email: Email, code: string): Promise<boolean> {
    const redisCode = await this.redis.get(email);
    const equal = redisCode === code;
    if (equal) {
      this.redis.del(email);
    }
    return equal;
  }

  sendMail(emails: Email[], template: string, subject: string) {
    // 每次发送邮件都去数据库拿一次数据，比较费时，可以考虑拿一次就放在 redis 中
    return new Promise(async (resolve, reject) => {
      const smtpKeyConfig: any = await this.kmsService.getSmtpKeyConfig();
      if (!smtpKeyConfig) {
        reject('密钥获取失败');
      }
      const transporter = nodemailer.createTransport({
        service: 'qq',
        port: 465,
        secureConnection: true,
        auth: smtpKeyConfig,
      });
      const mailOptions = {
        from: 'ElevenDing <1559298665@qq.com>', // 发件地址
        to: emails, // 收件列表
        subject: subject, // 标题
        html: template,
      };

      transporter.sendMail(mailOptions, function (error: Error) {
        error && reject(error);
        resolve('');
        transporter.close(); // 如果没用，关闭连接池
      });
    });
  }
}
