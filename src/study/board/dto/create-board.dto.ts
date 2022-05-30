import { IsInt, Length } from 'class-validator';

export class RegisterBoardDto {
  @IsInt()
  id: string;

  @Length(4, 40)
  title: string;
  // content: string;
  // created_date: string;
  // updated_date: string;
}
