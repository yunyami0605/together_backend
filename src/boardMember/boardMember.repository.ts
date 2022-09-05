import { InternalServerErrorException } from '@nestjs/common';
import { BoardMemberEntity } from 'src/entity/boardMember.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(BoardMemberEntity)
export class BoardMemberRepository extends Repository<BoardMemberEntity> {
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

  async removeBoardMember(boardId: number, userId: number): Promise<number> {
    try {
      const result = await this.createQueryBuilder('bm')
        .delete()
        .where({ boardId, userId })
        .execute();

      console.log(result);
      return boardId;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
