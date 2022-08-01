import {
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { TryCatch } from 'src/decorator/exceptrionDecorator';
import { EntityRepository, In, Repository } from 'typeorm';
import { CreateBoardDto } from '../dto/create-board.dto';
import { GetBoardListDto } from '../dto/get-boardList.dto';
import { UpdateBoardDto } from '../dto/update-board.dto';
import { StudyBoardEntity } from '../entity/board.entity';

@EntityRepository(StudyBoardEntity)
export class StudyBoardRepository extends Repository<StudyBoardEntity> {
  // create board
  async createBoard(
    createBoardDto: CreateBoardDto,
    writerId: number,
  ): Promise<StudyBoardEntity> {
    try {
      const {
        title,
        content,
        togetherType,
        contentType1,
        contentType2,
        location1,
        location2,
        location3,
        persons,
        period,
        tagList,
      } = createBoardDto;

      const board = this.create({
        title,
        content,
        // togetherType,
        contentType1,
        contentType2,

        location1,
        location2,
        location3,
        persons,
        period,
        tagList,
        writer: Number(writerId),

        // status: 'PUBLIC',
      });
      await this.save(board);
      return board;
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }

  // @ query type 변환시키기
  async findBoardList(query: GetBoardListDto, countInPage: number) {
    try {
      const {
        page,
        location1,
        location2,
        location3,
        contentType1,
        contentType2,
        searchTxt,
      } = query;

      const locationWhereQueryObj = {
        ...(location1 !== '0' && { location1 }),
        ...(location2 !== '0' && { location2 }),
        ...(location3 !== '0' && { location3 }),
        ...(contentType1 !== '0' && { contentType1 }),
        ...(contentType2 !== '0' && { contentType2 }),
      };

      const [list, count] = await this.createQueryBuilder('b')
        .select([
          'b.id',
          'b.title',
          'b.location1',
          'b.location2',
          'b.location3',
          'b.contentType1',
          'b.contentType2',
          'b.persons',
          'b.period',
          'b.view',
          'b.favorite',
          'b.like',
          'b.dislike',
          'b.createdAt',
          'b.tagList',
          'c',
          'u.nickname',
          // 'SUM(c)',
        ])
        .leftJoin('b.writer', 'u')
        .leftJoin('b.comment', 'c')
        .where(locationWhereQueryObj)
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
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  async findBoard(id: number) {
    try {
      const res = await this.createQueryBuilder('b')
        .select([
          'b.id',
          'b.title',
          'b.content',
          'b.togetherType',
          'b.contentType1',
          'b.contentType2',
          'b.location1',
          'b.location2',
          'b.location3',
          'b.persons',
          'b.period',
          'b.view',
          'b.favorite',
          'b.like',
          'b.dislike',
          'b.createdAt',
          'b.tagList',
          'b.writer',

          'u.id',
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
    try {
      const res = await this.createQueryBuilder()
        .update('studyBoard')
        .set(body)
        .where('id = :id', { id })
        .execute();

      return id;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async removeBoard(id: number) {
    try {
      await this.softDelete({ id });

      return id;
    } catch (error) {
      return error;
    }
  }
}
