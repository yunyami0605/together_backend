import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardController } from './controller/board.controller';
import { StudyBoardEntity } from './entity/board.entity';
import { StudyBoardRepository } from './repository/board.repository';
import { BoardService } from './service/board.service';

@Module({
  imports: [TypeOrmModule.forFeature([StudyBoardRepository])],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
