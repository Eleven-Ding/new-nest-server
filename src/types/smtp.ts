import { Email } from './user';

export type MailTemplate = string;

export type SmtpConfig = {
  user: string;
  pass: string;
};

export interface MailerProps {
  emails: Email[]; // 目标邮箱
  template: MailTemplate; // 模版
  subject: string; // 标题
}
