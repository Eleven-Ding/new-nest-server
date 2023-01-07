import { IsNotEmpty, IsPositive, Min } from 'class-validator';
export class FindAllDto {
  @IsNotEmpty()
  @Min(0)
  readonly limit: number;

  @Min(-1)
  @IsNotEmpty()
  readonly offset: number;
}
