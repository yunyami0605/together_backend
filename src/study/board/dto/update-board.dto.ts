import { IsOptional, Length } from 'class-validator';

export class UpdateBoardDto {
  @IsOptional()
  @Length(4, 40)
  title: string;

  @IsOptional()
  @Length(1, 200)
  content: string;
}
