import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RegisterBoardDto } from '../dto/create-board.dto';
import { BoardService } from '../service/board.service';

@Controller('study/board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get('/list')
  getBoardList(@Query('page') page: number) {
    console.log(process.env.DATABASE_USER);
    return this.boardService.getBoardList(page);
  }

  @Get()
  getBoardContent() {
    return this.boardService.getBoard();
  }

  @Post()
  registerBoard(@Body() body: RegisterBoardDto) {
    return this.boardService.registerBoard(body);
  }

  @Patch()
  updateBoard() {
    return this.boardService.updateBoard();
  }

  @Delete()
  deleteBoard() {
    return this.boardService.deleteBoard();
  }
}
