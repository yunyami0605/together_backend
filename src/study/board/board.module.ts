import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardController } from './board.controller';
import { StudyBoardRepository } from './board.repository';
import { BoardService } from './board.service';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/user.repository';
import { CommentRepository } from 'src/comment/comment.repository';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { extname } from 'path';
import { BoardMemberRepository } from 'src/boardMember/boardMember.repository';
import { TmpImgRepository } from 'src/tmpImg/TmpImg.repository';

/**
 *@description : board module to set multer module
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudyBoardRepository,
      CommentRepository,
      BoardMemberRepository,
      UserRepository,
      TmpImgRepository,
    ]),

    MulterModule.registerAsync({
      useFactory: async () => ({
        storage: diskStorage({
          destination: function (req, file, cb) {
            // 파일저장위치 + 년월 에다 업로드 파일을 저장한다.
            // 요 부분을 원하는 데로 바꾸면 된다.
            const dest = `files/`;

            if (!fs.existsSync(dest)) {
              fs.mkdirSync(dest, { recursive: true });
            }

            cb(null, dest);
          },

          filename: (req, file, cb) => {
            // 업로드 후 저장되는 파일명을 랜덤하게 업로드 한다.(동일한 파일명을 업로드 됐을경우 오류방지)
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            return cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
      }),
    }),
  ],
  controllers: [BoardController],
  providers: [BoardService, UserService],
})
export class BoardModule {}
