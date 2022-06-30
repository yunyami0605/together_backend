import { Injectable, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepo: CommentRepository) {}

  create(body: CreateCommentDto, writerId: number) {
    return this.commentRepo.createComment(body, writerId);
  }

  findAll(page: number) {
    const countInPage = 4;
    return this.commentRepo.getCommentList(page, countInPage);
  }

  findOne(id: number) {
    return this.commentRepo.getComment(id);
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return this.commentRepo.updateComment(id, updateCommentDto);
  }

  remove(id: number) {
    return this.commentRepo.removeComment(id);
  }
}
