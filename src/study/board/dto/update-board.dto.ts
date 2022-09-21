import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { CreateBoardDto } from './create-board.dto';

export class UpdateBoardDto extends PartialType(CreateBoardDto) {}
