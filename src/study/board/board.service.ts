import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentRepository } from 'src/comment/comment.repository';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
// import { StudyBoardEntity } from 'src/study/board/entity/board.entity';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { StudyBoardEntity } from './entity/board.entity';
import { StudyBoardRepository } from './repository/board.repository';

@Injectable()
export class BoardService {
  constructor(
    private readonly studyBoardRepo: StudyBoardRepository,
    private readonly userSerivce: UserService,
    private readonly commentRepo: CommentRepository,
  ) {}

  findList(page: number) {
    const countInPage = 10;

    return this.studyBoardRepo.findBoardList(page, countInPage);
  }

  async findOne(id: number) {
    const boardData = await this.studyBoardRepo.findBoard(id);
    const commentData = await this.commentRepo.getCommentList(id, 1, 4);

    if (boardData) {
      this.studyBoardRepo.increaseBoardView(boardData);
      return {
        ...boardData,
        view: boardData.view + 1,
        comment: commentData || [],
      };
    } else {
      throw new NotFoundException();
    }
  }

  setFavorite(id: number, isFavorite: number) {
    return this.studyBoardRepo.setBoardFavorite(id, isFavorite);
  }

  async create(
    body: CreateBoardDto,
    writerId: number,
  ): Promise<StudyBoardEntity> {
    return this.studyBoardRepo.createBoard(body, writerId);
  }

  update(id: number, body: UpdateBoardDto) {
    // return id;
    return this.studyBoardRepo.updateBoard(id, body);
  }

  async remove(id: number, userId?: number) {
    const boardData = await this.studyBoardRepo.findBoard(id);

    if (!userId) throw new HttpException('Not Access Authorization ', 403);

    if (boardData) {
      //@ts-ignore
      if (boardData.writer.id !== userId) {
        // # 해당 게시판에 대해 삭제 권한이 없을 경우
        throw new HttpException('Not Access Authorization ', 403);
      }
    } else {
      throw new HttpException('No Board', 403);
    }
    return this.studyBoardRepo.removeBoard(id);
  }
}
