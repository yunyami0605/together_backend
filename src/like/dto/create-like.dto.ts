import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateLikeDto {
  @IsString()
  boardId: string;

  @IsBoolean()
  isLike: boolean;
}
