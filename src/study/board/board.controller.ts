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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { UpdateBoardDto } from './dto/update-board.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { GetBoardListDto } from './dto/get-boardList.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

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
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  create(@Body() body, @UploadedFile() file: Express.Multer.File, @Req() req) {
    return this.boardService.create(
      body,
      file,
      req.user.userId,
      req.session?.filename,
    );
  }

  /**
   *@description test file upload route
   */
  @UseInterceptors(FileInterceptor('image'))
  @Post(':id/upload')
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return this.boardService.uploadFile(file, +id);
  }

  @UseInterceptors(FileInterceptor('image'))
  @Post('/upload/tmp_image')
  tmpImgUpload(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    type TSession = typeof req.session;
    let session = req.session as TSession & { filename: string };

    const tmpPath = `${file.destination}${file.filename}`;
    session.filename = session.filename || '';
    session.filename = session?.filename
      ? `${session?.filename};${tmpPath}`
      : tmpPath;

    this.boardService.uploadTmpImg(tmpPath);
    return `${file.destination}${file.filename}`;
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

  @Get('/count')
  count(@Param('tmp') tmp: string) {
    return Number(tmp) + 1;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/member')
  addBoardMember(@Param('id') boardId, @Req() req) {
    return this.boardService.addBoardMember(boardId, req.user?.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/member')
  removeBoardMember(@Param('id') boardId, @Req() req) {
    return this.boardService.removeBoardMember(boardId, req?.user?.userId);
  }
}
