import {
  Body,
  Controller,
  Delete,
  Get,
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
import { TRequest } from 'src/@types/common';
import { CreateBoardDto } from './dto/create-board.dto';

/**
 *@description : all board controller
 */
@Controller('api/study/board')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly userService: UserService,
  ) {}

  /**
   *@description : set favorite on board
   *@param {string} favorite - favorite about board
   *@param {string} id - board id
   */
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
  findOne(@Param('id') id: string) {
    return this.boardService.findOne(+id);
  }

  /**
   *@description : create board
   *@param {CreateBoardDto} body - board content to create
   */
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  create(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: TRequest,
  ) {
    const data: CreateBoardDto = body;

    return this.boardService.create(
      data,
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

  /**
   *@description : 게시판 등록 에디터에 올라오는 임시 이미지.
   */
  @UseInterceptors(FileInterceptor('image'))
  @Post('/upload/tmp_image')
  tmpImgUpload(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: TRequest,
  ) {
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
  @UseInterceptors(FileInterceptor('image'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.boardService.update(+id, body, file);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: TRequest) {
    return this.boardService.remove(+id, req?.user?.userId);
  }

  /**
   *@description : add board member to partipate group
   *@param {string} boardId - board id
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/member')
  addBoardMember(@Param('id') boardId: string, @Req() req: TRequest) {
    return this.boardService.addBoardMember(+boardId, req.user?.userId);
  }

  /**
   *@description : delete board member to partipate group
   *@param {string} boardId - board id
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id/member')
  removeBoardMember(@Param('id') boardId: string, @Req() req: TRequest) {
    return this.boardService.removeBoardMember(+boardId, req?.user?.userId);
  }
}
