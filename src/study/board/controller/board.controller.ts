import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RegisterBoardDto, UpdateBoardDto } from '../dto/create-board.dto';
import { BoardService } from '../service/board.service';

@Controller('study/board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get('/list')
  getBoardList(@Query('page') page: number) {
    console.log(page);
    return this.boardService.getBoardList(page);
    // return 2;
  }

  @Get(':id')
  getBoardContent(@Param('id') id: number) {
    return this.boardService.getBoard(id);
  }

  @Post()
  registerBoard(@Body() body: RegisterBoardDto) {
    return this.boardService.registerBoard(body);
  }

  @Patch(':id')
  updateBoard(@Param('id') id: number, @Body() body: UpdateBoardDto) {
    console.log('@ UPD');
    console.log(body);
    return this.boardService.updateBoard(id, body);
  }

  @Delete(':id')
  deleteBoard(@Param('id') id: number) {
    return this.boardService.deleteBoard(id);
  }
}
