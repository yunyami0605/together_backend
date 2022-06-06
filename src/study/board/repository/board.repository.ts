import { EntityRepository, Repository } from 'typeorm';
import { RegisterBoardDto, UpdateBoardDto } from '../dto/create-board.dto';
import { StudyBoardEntity } from '../entity/board.entity';

@EntityRepository(StudyBoardEntity)
export class StudyBoardRepository extends Repository<StudyBoardEntity> {
  //
  // create board
  async createBoardRepo(
    createBoardDto: RegisterBoardDto,
  ): Promise<StudyBoardEntity> {
    const { title, content } = createBoardDto;
    const board = this.create({
      title,
      content,
      // status: 'PUBLIC',
    });
    await this.save(board);
    return board;
  }

  async getBoardListRepo(page: number, countInPage: number) {
    const res = await this.createQueryBuilder('studyBoard')
      .limit(page * countInPage)
      .skip((page - 1) * countInPage)
      // .where('studyBoard.id = :id', { id: 1 })
      .getMany();

    return res;
  }

  async getBoardRepo(id: number) {
    const res = await this.findOne({ where: { id } });

    console.log(res);

    // # add undeined error logic
    return res;
  }

  async updateBoardRepo(id: number, body: UpdateBoardDto) {
    const res = await this.createQueryBuilder()
      .update('studyBoard')
      .set(body)
      .where('id = :id', { id })
      .execute();

    return id;
  }

  async deleteBoardRepo(id: number) {
    const res = await this.softDelete({ id });

    console.log(res);
    return id;
  }
}
