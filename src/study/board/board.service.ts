import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentRepository } from 'src/comment/comment.repository';
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

  remove(id: number) {
    return this.studyBoardRepo.removeBoard(id);
  }
}
