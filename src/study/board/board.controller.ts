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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardService } from './board.service';
import { UpdateBoardDto } from './dto/update-board.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { GetBoardListDto } from './dto/get-boardList.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

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
  findList(@Query() query: GetBoardListDto) {
    return this.boardService.findList(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.boardService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: CreateBoardDto, @Req() req) {
    return this.boardService.create(body, req.user.userId);
  }

  @UseInterceptors(FileInterceptor('image'))
  @Post('/upload')
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    // console.log(file);
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
