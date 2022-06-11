import { IsInt, IsOptional, Length } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateBoardDto {
  @Length(4, 40)
  title: string;

  @Length(1, 200)
  content: string;
}

export class UpdateBoardDto {
  @IsOptional()
  @Length(4, 40)
  title: string;

  @IsOptional()
  @Length(1, 200)
  content: string;
}
