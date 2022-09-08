import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateBoardDto {
  @IsNumber()
  contentType1: number;

  @IsNumber()
  contentType2: number;

  @IsNumber()
  togetherType: number;

  @IsNumber()
  location1: number;

  @IsNumber()
  location2: number;

  @IsNumber()
  location3: number;

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
  @Length(10, 255, { message: 'length is not valid' })
  content: string;
}
