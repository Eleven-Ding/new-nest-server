import { EMAIL_REGEX } from './../../../share/constant';
import { Email } from 'src/types';
import { Matches } from 'class-validator';

export class SendCodeDto {
  @Matches(EMAIL_REGEX, {
    message: '需要正确的邮箱格式~',
  })
  readonly email!: Email;
}
