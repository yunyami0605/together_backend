import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from 'src/comment/comment.repository';
import { UserService } from 'src/user/user.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { GetBoardListDto } from './dto/get-boardList.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { StudyBoardRepository } from './board.repository';
import { BoardMemberRepository } from 'src/boardMember/boardMember.repository';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class BoardService {
  constructor(
    private readonly studyBoardRepo: StudyBoardRepository,
    private readonly boardMemberRepo: BoardMemberRepository,
    private readonly commentRepo: CommentRepository,
    private readonly usertRepo: UserRepository,
  ) {}

  findList(query: GetBoardListDto) {
    const countInPage = 10;

    return this.studyBoardRepo.findBoardList(query, countInPage);
    // return this.studyBoardRepo.test();
  }

  async findOne(id: number) {
    const boardData = await this.studyBoardRepo.findBoard(id);
    const commentData = await this.commentRepo.getCommentList(id, 1, 4);
    const memberList = await this.usertRepo.getBoardMember(id);

    if (boardData) {
      this.studyBoardRepo.increaseBoardView(boardData);
      return {
        ...boardData,
        view: boardData.view + 1,
        comment: commentData || [],
        member: memberList,
      };
    } else {
      throw new NotFoundException();
    }
  }

  uploadFile(file: Express.Multer.File, id: number) {
    return this.studyBoardRepo.uploadFile(file, id);
  }

  setFavorite(id: number, isFavorite: number) {
    return this.studyBoardRepo.setBoardFavorite(id, isFavorite);
  }

  async create(
    body: CreateBoardDto,
    file: Express.Multer.File,
    writerId: number,
  ) {
    const boardId = await this.studyBoardRepo.createBoard(body, file, writerId);
    this.boardMemberRepo.createBoardMember(boardId, writerId);
    return boardId;
  }

  update(id: number, body: UpdateBoardDto) {
    return this.studyBoardRepo.updateBoard(id, body);
  }

  async remove(id: number, userId?: number) {
    const boardData = await this.studyBoardRepo.findBoard(id);

    if (!userId) throw new HttpException('Not Access Authorization ', 403);

    if (boardData) {
      //@ts-ignore
      if (boardData.writer.id !== userId) {
        // # 해당 게시판에 대해 삭제 권한이 없을 경우
        throw new HttpException('Not Access Authorization ', 403);
      }
    } else {
      throw new HttpException('No Board', 403);
    }
    return this.studyBoardRepo.removeBoard(id);
  }

  addBoardMember(boardId: number, userId: number) {
    return this.boardMemberRepo.createBoardMember(boardId, userId);
  }
}
