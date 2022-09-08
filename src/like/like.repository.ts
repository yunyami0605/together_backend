import { InternalServerErrorException } from '@nestjs/common';
import { LikeEntity } from 'src/entity/like.entity';
import { EntityRepository, Repository } from 'typeorm';

/**
 *@description : board like api repository
 */
@EntityRepository(LikeEntity)
export class LikeRepository extends Repository<LikeEntity> {
  async createLike(boardId: number, userId: number) {
    try {
      const likeEnt = this.create({ boardId, userId });

      const result = await this.save(likeEnt);

      return { id: result.id };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async removeLike(boardId: number, userId: number) {
    try {
      await this.createQueryBuilder()
        .delete()
        .where({ boardId, userId })
        .execute();

      return boardId;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   *@description : 유저의 게시판 like 여부 확인 및 게시판 like 수 반환 로직
   *@param {string} board_id
   *@param {string} user_id
   */
  async findLikeList(query: { board_id: string; user_id: string }) {
    try {
      const likeCount = await this.count({
        where: { boardId: +query.board_id },
      });

      // 요청 USER의 ID로 좋아요 여부 판별
      const isLike = await this.findOne({ where: { userId: +query.user_id } });

      return { count: likeCount, isLike: isLike && true };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
