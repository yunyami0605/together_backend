import {
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BoardService } from './board.service';

@Controller('study/board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get('/list')
  getBoardList(@Query('page') page: number) {
    return this.boardService.getBoardList(page);
  }

  @Get()
  getBoardContent() {
    return this.boardService.getBoard();
  }

  @Post()
  registerBoard() {
    return this.boardService.registerBoard();
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
