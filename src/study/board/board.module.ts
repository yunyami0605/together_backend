import { Module } from '@nestjs/common';
import { BoardController } from './controller/board.controller';
import { BoardService } from './service/board.service';

@Module({
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
