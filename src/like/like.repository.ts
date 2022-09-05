import { InternalServerErrorException } from '@nestjs/common';
import { LikeEntity } from 'src/entity/like.entity';
import { EntityRepository, Repository } from 'typeorm';

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
      const result = await this.createQueryBuilder()
        .delete()
        .where({ boardId, userId })
        .execute();

      return 1;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findLikeList(query: { board_id: string; user_id: string }) {
    try {
      const likeCount = await this.count({
        where: { boardId: +query.board_id },
      });

      console.log(query.user_id);

      const isLike = await this.findOne({ where: { userId: +query.user_id } });

      return { count: likeCount, isLike: isLike && true };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
