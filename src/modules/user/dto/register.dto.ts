import { UserName, PassWord, Email } from 'src/types';
import { IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(3, 20)
  readonly username!: UserName;

  @IsString()
  @Length(6, 20)
  readonly password!: PassWord;

  @Length(6, 20)
  @IsString()
  readonly email!: Email;
}
