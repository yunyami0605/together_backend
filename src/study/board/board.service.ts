import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { StudyBoardEntity } from 'src/study/board/entity/board.entity';
import { Repository } from 'typeorm';
import { CreateBoardDto, UpdateBoardDto } from './dto/create-board.dto';
import { StudyBoardEntity } from './entity/board.entity';
import { StudyBoardRepository } from './repository/board.repository';

@Injectable()
export class BoardService {
  // @InjectRepository(StudyBoardEntity)
  // private workspacesRepository: Repository<StudyBoardEntity>;

  constructor(private readonly studyBoardRepo: StudyBoardRepository) {}

  findList(page: number) {
    const countInPage = 3;

    return this.studyBoardRepo.findBoardList(page, countInPage);
  }

  findOne(id: number) {
    return this.studyBoardRepo.findBoard(id);
  }

  create(body: CreateBoardDto): Promise<StudyBoardEntity> {
    return this.studyBoardRepo.createBoard(body);
  }

  update(id: number, body: UpdateBoardDto) {
    // return id;
    return this.studyBoardRepo.updateBoard(id, body);
  }

  remove(id: number) {
    return this.studyBoardRepo.removeBoard(id);
  }
}
