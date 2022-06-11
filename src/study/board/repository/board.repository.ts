import { Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateBoardDto, UpdateBoardDto } from '../dto/create-board.dto';
import { StudyBoardEntity } from '../entity/board.entity';

@EntityRepository(StudyBoardEntity)
export class StudyBoardRepository extends Repository<StudyBoardEntity> {
  //
  // create board
  async createBoard(createBoardDto: CreateBoardDto): Promise<StudyBoardEntity> {
    const { title, content } = createBoardDto;
    const board = this.create({
      title,
      content,
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
        count,
        lastPage: Math.ceil(count / countInPage),
      };
    } catch (e: any) {
      return null;
    }
  }

  async findBoard(id: number) {
    const res = await this.findOne({ where: { id } });

    // # add undeined error logic
    return res;
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
