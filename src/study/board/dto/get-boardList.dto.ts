import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetBoardListDto {
  @IsOptional()
  // @IsNumber()
  @IsString()
  location1: string;

  @IsOptional()
  // @IsNumber()
  @IsString()
  location2: string;

  @IsOptional()
  // @IsNumber()
  @IsString()
  location3: string;

  @IsOptional()
  // @IsNumber()
  @IsString()
  contentType1: string;

  @IsOptional()
  @IsString()
  contentType2: string;

  @IsOptional()
  @IsString()
  searchTxt: string;

  @IsString()
  page: number;
}
