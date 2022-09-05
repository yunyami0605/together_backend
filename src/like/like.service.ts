import { Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { LikeRepository } from './like.repository';

@Injectable()
export class LikeService {
  constructor(private readonly likeRepo: LikeRepository) {}

  create(body: CreateLikeDto, userId: number) {
    const { boardId, isLike } = body;

    if (isLike) {
      return this.likeRepo.createLike(+boardId, userId);
    } else {
      return this.likeRepo.removeLike(+boardId, userId);
    }
  }

  findAll(query: { board_id: string; user_id: string }) {
    return this.likeRepo.findLikeList(query);
  }

  findOne(id: number) {
    return `This action returns a #${id} like`;
  }

  update(id: number, updateLikeDto: UpdateLikeDto) {
    return `This action updates a #${id} like`;
  }

  remove(id: number) {
    return `This action removes a #${id} like`;
  }
}
