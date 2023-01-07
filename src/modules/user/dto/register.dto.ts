import { UserName, PassWord, Email } from 'src/types';
import { IsString, Length } from 'class-validator';
import { DETAULT_CODE_COUNT } from 'src/share/constant';
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

  @Length(DETAULT_CODE_COUNT)
  readonly code: string;
}
