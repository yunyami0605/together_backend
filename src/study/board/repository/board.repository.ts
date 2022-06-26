import { InternalServerErrorException, Logger } from '@nestjs/common';
import { TryCatch } from 'src/decorator/exceptrionDecorator';
import { EntityRepository, Repository } from 'typeorm';
import { CreateBoardDto } from '../dto/create-board.dto';
import { UpdateBoardDto } from '../dto/update-board.dto';
import { StudyBoardEntity } from '../entity/board.entity';

@EntityRepository(StudyBoardEntity)
export class StudyBoardRepository extends Repository<StudyBoardEntity> {
  // create board
  async createBoard(createBoardDto: CreateBoardDto): Promise<StudyBoardEntity> {
    const { title, content, type, location, persons, period } = createBoardDto;
    const board = this.create({
      title,
      content,
      type,
      location,
      persons,
      period,
      // status: 'PUBLIC',
    });
    await this.save(board);
    return board;
  }

  async findBoardList(page: number, countInPage: number) {
    try {
      const [list, count] = await this.createQueryBuilder('studyBoard')
        .offset((page - 1) * countInPage)
        .limit(page * countInPage)
        .getManyAndCount();

      return {
        list,
        total: count,
        curPage: page,
        perPage: countInPage,
        lastPage: Math.ceil(count / countInPage),
      };
    } catch (e: any) {
      throw new InternalServerErrorException();
    }
  }

  async findBoard(id: number) {
    try {
      const res = await this.findOne({ where: { id } });

      return res;
    } catch (e: any) {
      throw new InternalServerErrorException();
    }
  }

  async increaseBoardView(boardData: StudyBoardEntity) {
    try {
      boardData.view += 1;

      this.save(boardData);

      return boardData;
    } catch (e: any) {
      throw new InternalServerErrorException();
    }
  }

  async updateBoard(id: number, body: UpdateBoardDto) {
    const res = await this.createQueryBuilder()
      .update('studyBoard')
      .set(body)
      .where('id = :id', { id })
      .execute();

    return id;
  }

  async removeBoard(id: number) {
    const res = await this.softDelete({ id });

    return id;
  }
}
