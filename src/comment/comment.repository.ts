import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentEntity } from './entities/comment.entity';

/**
 *@description : control comment db on repo
 *@param {CreateCommentDto} body - create comment data
 */
@EntityRepository(CommentEntity)
export class CommentRepository extends Repository<CommentEntity> {
  /**
   *@description : create comment db data
   *@param {CreateCommentDto} body - comment content
   */
  async createComment(body: CreateCommentDto, writerId: number) {
    try {
      const { content, boardId } = body;

      const comment = this.create({ content, boardId, writerId });

      console.log(comment);
      await this.save(comment);

      return comment;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   *@description : get comment list on db
   *@param {number} page - list page
   *@param {number} countInPage - per page on list
   */
  async getCommentList(page: number, countInPage: number) {
    try {
      const [list, count] = await this.createQueryBuilder()
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

  /**
   *@description : get comment data
   *@param {number} id - comment id
   */
  async getComment(id: number) {
    try {
      const res = await this.createQueryBuilder('b')
        .where('b.id = :id', { id })
        .getOne();

      return res;
    } catch (e: any) {
      throw new InternalServerErrorException();
    }
  }

  /**
   *@description : update comment content
   *@param {number} id - comment id
   *@param {UpdateCommentDto} body - contains update data
   */
  async updateComment(id: number, body: UpdateCommentDto) {
    try {
      const res = await this.createQueryBuilder()
        .update('comment')
        .set(body)
        .where('id = :id', { id })
        .execute();

      return id;
    } catch (error) {}
  }

  /**
   *@description : soft remove comment data on db
   *@param {number} id - comment id
   */
  async removeComment(id: number) {
    try {
      const res = await this.softDelete({ id });

      return id;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
