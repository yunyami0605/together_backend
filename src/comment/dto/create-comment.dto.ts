import { IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @MaxLength(255)
  @IsString()
  content: string;

  @IsNumber()
  boardId: number;
}
