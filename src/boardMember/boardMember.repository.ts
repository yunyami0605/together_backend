import { InternalServerErrorException } from '@nestjs/common';
import { BoardMemberEntity } from 'src/entity/boardMember.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(BoardMemberEntity)
export class BoardMemberRepository extends Repository<BoardMemberEntity> {
  /**
   *@description : add member to participate content on board
   *@param {number} boardId - board id
   *@param {number} userId - user id
   */
  async createBoardMember(
    boardId: number,
    userId: number,
  ): Promise<BoardMemberEntity> {
    try {
      const boardMember = this.create({
        boardId,
        userId,
      });

      const result = this.save(boardMember);

      return result;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  /**
   *@description : remove member participated on board
   *@param {number} boardId - board id
   *@param {number} userId - user id
   */
  async removeBoardMember(boardId: number, userId: number): Promise<number> {
    try {
      await this.createQueryBuilder('bm')
        .delete()
        .where({ boardId, userId })
        .execute();

      return boardId;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
