import {
  IsArray,
  IsDate,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  Length,
} from 'class-validator';

export class CreateBoardDto {
  type: string;
  location: string;

  @IsNumber()
  persons: number;

  @IsDateString()
  @Length(8)
  period: string;

  @IsOptional()
  @IsArray()
  tagList: string[];

  @Length(4, 40)
  title: string;

  @Length(10, 1000)
  content: string;
}
