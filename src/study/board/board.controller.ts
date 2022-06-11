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
import { CreateBoardDto, UpdateBoardDto } from './dto/create-board.dto';
import { BoardService } from './board.service';

@Controller('study/board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get('/list')
  findList(@Query('page') page: string) {
    return this.boardService.findList(+page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardService.findOne(+id);
  }

  @Post()
  create(@Body() body: CreateBoardDto) {
    return this.boardService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateBoardDto) {
    return this.boardService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardService.remove(+id);
  }
}
