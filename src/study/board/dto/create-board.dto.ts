import {
  IsArray,
  IsDate,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { UpdateBoardDto } from './update-board.dto';

export class CreateBoardDto {
  @IsNumber()
  type: number;

  @IsString()
  location: string;

  @IsNumber()
  persons: number;

  @IsDateString()
  @Length(8)
  period: string;

  @IsOptional()
  @IsArray()
  tagList: string[];

  @IsString()
  @Length(4, 40)
  title: string;

  @IsString()
  @Length(10, 255)
  content: string;
}
