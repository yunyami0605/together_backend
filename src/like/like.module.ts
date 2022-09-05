import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeRepository } from './like.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LikeRepository])],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
