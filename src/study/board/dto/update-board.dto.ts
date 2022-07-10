import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateBoardDto {
  @IsOptional()
  @Length(4, 40)
  title: string;

  @IsNumber()
  type: number;

  @IsOptional()
  @Length(10, 255)
  content: string;

  @IsNumber()
  persons: number;

  @IsDateString()
  @Length(8)
  period: string;

  @IsOptional()
  @IsArray()
  tagList: string[];

  @IsString()
  location: string;
}
