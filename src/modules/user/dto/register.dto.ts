import { UserName, PassWord, Email } from 'src/types';

export class RegisterDto {
  readonly username: UserName;

  readonly password: PassWord;

  readonly email: Email;
}
