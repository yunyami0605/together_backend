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

  @UseGuards(JwtAuthGuard)
  @Get('/favorite')
  setFavorite(@Query() query: { id: string; favorite: string }) {
    const { id, favorite } = query;
    return this.boardService.setFavorite(+id, +favorite);
  }

  @Get('/list')
  async findList(@Query('page') page: string) {
    return this.boardService.findList(+page);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.boardService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: CreateBoardDto, @Req() req) {
    console.log(body);
    return this.boardService.create(body, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateBoardDto) {
    return this.boardService.update(+id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.boardService.remove(+id, req?.user?.userId);
  }
}
