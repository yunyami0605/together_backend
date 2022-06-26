import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardController } from './board.controller';
import { StudyBoardRepository } from './repository/board.repository';
import { BoardService } from './board.service';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { UserRepository } from 'src/user/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudyBoardRepository]),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [BoardController],
  providers: [BoardService, UserService],
})
export class BoardModule {}
