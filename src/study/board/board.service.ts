import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { StudyBoardEntity } from 'src/study/board/entity/board.entity';
import { Repository } from 'typeorm';
import { RegisterBoardDto, UpdateBoardDto } from './dto/create-board.dto';
import { StudyBoardEntity } from './entity/board.entity';
import { StudyBoardRepository } from './repository/board.repository';

@Injectable()
export class BoardService {
  // @InjectRepository(StudyBoardEntity)
  // private workspacesRepository: Repository<StudyBoardEntity>;

  constructor(
    @InjectRepository(StudyBoardRepository)
    private studyBoardRepo: StudyBoardRepository,
  ) {}

  getBoardList(page: number) {
    const countInPage = 3;

    return this.studyBoardRepo.getBoardListRepo(page, countInPage);
  }

  getBoard(id: number) {
    return this.studyBoardRepo.getBoardRepo(id);
  }

  registerBoard(body: RegisterBoardDto): Promise<StudyBoardEntity> {
    return this.studyBoardRepo.createBoardRepo(body);
  }

  updateBoard(id: number, body: UpdateBoardDto) {
    // return id;
    return this.studyBoardRepo.updateBoardRepo(id, body);
  }

  deleteBoard(id: number) {
    return this.studyBoardRepo.deleteBoardRepo(id);
  }
}
