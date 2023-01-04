import { IsNotEmpty } from 'class-validator';
export class FindAllDto {
  @IsNotEmpty()
  readonly limit: number;

  @IsNotEmpty()
  readonly offset: number;
}
