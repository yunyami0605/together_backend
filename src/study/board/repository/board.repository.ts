import {
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { TryCatch } from 'src/decorator/exceptrionDecorator';
import { EntityRepository, In, Repository } from 'typeorm';
import { CreateBoardDto } from '../dto/create-board.dto';
import { UpdateBoardDto } from '../dto/update-board.dto';
import { StudyBoardEntity } from '../entity/board.entity';

@EntityRepository(StudyBoardEntity)
export class StudyBoardRepository extends Repository<StudyBoardEntity> {
  // create board
  async createBoard(
    createBoardDto: CreateBoardDto,
    writerId: number,
  ): Promise<StudyBoardEntity> {
    const { title, content, type, location, persons, period } = createBoardDto;
    const board = this.create({
      title,
      content,
      type,
      location,
      persons,
      period,
      writer: Number(writerId),
      // status: 'PUBLIC',
    });
    await this.save(board);
    return board;
  }

  async findBoardList(page: number, countInPage: number) {
    try {
      const [list, count] = await this.createQueryBuilder('b')
        .select([
          'b.id',
          'b.title',
          'b.location',
          'b.persons',
          'b.period',
          'b.view',
          'b.favorite',
          'b.like',
          'b.dislike',
          'b.createdAt',
          'u.nickname',
        ])
        .leftJoin('b.writer', 'u')
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
      const res = await this.createQueryBuilder('b')
        .select([
          'b.id',
          'b.title',
          'b.content',
          'b.type',
          'b.location',
          'b.persons',
          'b.period',
          'b.view',
          'b.favorite',
          'b.like',
          'b.dislike',
          'b.createdAt',
          'u.nickname',
        ])
        .leftJoin('b.writer', 'u')
        .where('b.id = :id', { id })
        .getOne();

      console.log(res);
      return res;
    } catch (e: any) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  /**
   *@description : increase view count on board table
   *@param {StudyBoardEntity} boardData - study board entity
   */
  async increaseBoardView(boardData: StudyBoardEntity) {
    try {
      boardData.view += 1;

      this.save(boardData);

      return boardData;
    } catch (e: any) {
      throw new InternalServerErrorException();
    }
  }

  /**
   *@description : set favorite column on study board table
   *@param {number} id - study board entity
   */
  async setBoardFavorite(id: number, isFavorite: number) {
    try {
      const board = await this.findBoard(id);

      if (board) {
        board.favorite += isFavorite === 0 ? -1 : 1;

        if (board.favorite < 0) board.favorite = 0;

        this.save(board);
        return board.favorite;
      } else {
        throw new HttpException('Not Access Board ', 403);
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  /**
   *@description
   *@param {}  -
   */
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
