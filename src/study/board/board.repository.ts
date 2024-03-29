import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, In, Like, Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { GetBoardListDto } from './dto/get-boardList.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { StudyBoardEntity } from '../../entity/board.entity';

@EntityRepository(StudyBoardEntity)
export class StudyBoardRepository extends Repository<StudyBoardEntity> {
  // create board
  async createBoard(
    createBoardDto: CreateBoardDto,
    file: Express.Multer.File,
    writerId: number,
  ): Promise<number> {
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

      /**
       * filepath: files\548ee35d6cc91c9505c6dcde7d46788b.png
       */

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
        imgPath: file.path,
      });
      await this.save(board);
      return board.id;
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }

  async uploadFile(file: Express.Multer.File, id: number) {
    try {
      const res = await this.createQueryBuilder()
        .update('studyBoard')
        .set({
          imgPath: file.path,
        })
        .where('id = :id', { id })
        .execute();

      return {
        filename: file.filename,
        path: file.path,
      };
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

      const txt = decodeURIComponent(searchTxt);

      const locationWhereQueryObj = {
        ...(location1 !== '0' && { location1 }),
        ...(location2 !== '0' && { location2 }),
        ...(location3 !== '0' && { location3 }),
        ...(contentType1 !== '0' && { contentType1 }),
        ...(contentType2 !== '0' && { contentType2 }),
        ...(txt !== '' && { title: Like(`%${txt}%`) }),
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
          'b.imgPath',
          'c',
          'u.nickname',
          // 'm',
          // 'SUM(c)',
        ])
        .leftJoin('b.writer', 'u')
        .leftJoin('b.comment', 'c')
        // .leftJoin('b.members', 'm')
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
          'b.imgPath',

          'u.id',
          'u.nickname',
        ])
        .leftJoin('b.writer', 'u')
        .where('b.id = :id', { id })
        .getOne();

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
   *@description : update board repo
   */
  async updateBoard(
    id: number,
    body: UpdateBoardDto,
    file?: Express.Multer.File,
  ) {
    try {
      const dataSet = file
        ? {
            ...body,
            imgPath: file.path,
          }
        : body;

      await this.createQueryBuilder()
        .update('studyBoard')
        .set({
          ...dataSet,
        })
        .where('id = :id', { id })
        .execute();

      return id;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   *@description : remove board repo
   */
  async removeBoard(id: number) {
    try {
      await this.softDelete({ id });

      return id;
    } catch (error) {
      return error;
    }
  }
}
