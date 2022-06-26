import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardService } from './board.service';
import { UpdateBoardDto } from './dto/update-board.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserService } from 'src/user/user.service';

@Controller('api/study/board')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly userService: UserService,
  ) {}

  @Header('Custom', 'Test Header')
  @Get('/list')
  async findList(@Query('page') page: string) {
    const res = await this.userService.findOne(1);

    return this.boardService.findList(+page);
  }

  // @UseGuards(JwtAuthGuard)
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
