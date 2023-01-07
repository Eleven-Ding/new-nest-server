import { IsNotEmpty, Min } from 'class-validator';
export class FindAllDto {
  @IsNotEmpty()
  @Min(0)
  readonly limit: number;

  @Min(0)
  @IsNotEmpty()
  readonly offset: number;
}
