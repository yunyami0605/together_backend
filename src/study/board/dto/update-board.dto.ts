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
