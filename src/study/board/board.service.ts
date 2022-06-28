import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
  ) {}

  findList(page: number) {
    const countInPage = 10;

    return this.studyBoardRepo.findBoardList(page, countInPage);
  }

  async findOne(id: number) {
    const boardData = await this.studyBoardRepo.findBoard(id);

    if (boardData) {
      this.studyBoardRepo.increaseBoardView(boardData);
      return {
        ...boardData,
        view: boardData.view + 1,
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
    authorId: number,
  ): Promise<StudyBoardEntity> {
    return this.studyBoardRepo.createBoard(body, authorId);
  }

  update(id: number, body: UpdateBoardDto) {
    // return id;
    return this.studyBoardRepo.updateBoard(id, body);
  }

  remove(id: number) {
    return this.studyBoardRepo.removeBoard(id);
  }
}
