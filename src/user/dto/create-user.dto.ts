import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsArray()
  @IsNotEmpty()
  careerList: [number, number][];

  @IsNumber()
  @IsNotEmpty()
  location1: number;

  @IsNumber()
  @IsNotEmpty()
  location2: number;

  @IsNumber()
  socialID: number;

  @IsString()
  socialType: string;
}
