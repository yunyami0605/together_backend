import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardController } from './board.controller';
import { StudyBoardRepository } from './repository/board.repository';
import { BoardService } from './board.service';

@Module({
  imports: [TypeOrmModule.forFeature([StudyBoardRepository])],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
