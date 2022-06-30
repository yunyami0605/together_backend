import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @MaxLength(255)
  @IsString()
  content: string;

  @IsNumber()
  boardId: number;
}
