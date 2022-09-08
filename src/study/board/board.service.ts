import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from 'src/comment/comment.repository';
import { CreateBoardDto } from './dto/create-board.dto';
import { GetBoardListDto } from './dto/get-boardList.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { StudyBoardRepository } from './board.repository';
import { BoardMemberRepository } from 'src/boardMember/boardMember.repository';
import { UserRepository } from 'src/user/user.repository';
import { TmpImgRepository } from 'src/tmpImg/TmpImg.repository';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserEntity } from 'src/entity/user.entity';

/**
 *@description : board api service
 */
@Injectable()
export class BoardService {
  constructor(
    private readonly studyBoardRepo: StudyBoardRepository,
    private readonly boardMemberRepo: BoardMemberRepository,
    private readonly commentRepo: CommentRepository,
    private readonly userRepo: UserRepository,
    private readonly tmpImgRepo: TmpImgRepository,
  ) {}

  findList(query: GetBoardListDto) {
    const countInPage = 10;

    return this.studyBoardRepo.findBoardList(query, countInPage);
  }

  async findOne(id: number) {
    const boardData = await this.studyBoardRepo.findBoard(id);
    const commentData = await this.commentRepo.getCommentList(id, 1, 4);
    const memberList = await this.userRepo.getBoardMember(id);

    if (boardData) {
      // 게시판 데이터 존재시, 조회수 증가 및 데이터 응답
      this.studyBoardRepo.increaseBoardView(boardData);
      return {
        ...boardData,
        view: boardData.view + 1,
        comment: commentData,
        member: memberList,
      };
    } else {
      throw new NotFoundException();
    }
  }

  /**
   *@description test file upload service logic
   */
  uploadFile(file: Express.Multer.File, id: number) {
    return this.studyBoardRepo.uploadFile(file, id);
  }

  /**
   *@description
   *@param {number} id - board id
   *@param {number} isFavorite - board id
   */
  setFavorite(id: number, isFavorite: number) {
    return this.studyBoardRepo.setBoardFavorite(id, isFavorite);
  }

  /**
   *@description : create board
   *@param {CreateBoardDto} body - board content to create
   *@param {Express.Multer.File} file - board to main img file
   *@param {number} writerId
   *@param {string | undefined} filename
   */
  async create(
    body: CreateBoardDto,
    file: Express.Multer.File,
    writerId: number,
    filename: string | undefined,
  ) {
    const boardId = await this.studyBoardRepo.createBoard(body, file, writerId);
    if (filename) this.tmpImgRepo.deleteTmpImg(filename);
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

  /**
   *@description : add board member to particpate group
   *@param {number} boardId
   *@param {number} userId - user id to participate group
   */
  async addBoardMember(boardId: number, userId: number) {
    const boardData = await this.studyBoardRepo.findBoard(boardId);

    const writer = boardData.writer as unknown as UserEntity;

    // 작성자랑 신청유저가 같을 경우 에러 반환
    if (writer.id === userId)
      throw new HttpException("Writer don't add board member myself ", 403);

    return this.boardMemberRepo.createBoardMember(boardId, userId);
  }

  removeBoardMember(boardId: number, userId: number) {
    return this.boardMemberRepo.removeBoardMember(boardId, userId);
  }

  /**
   *@description : 게시판 등록 에디터에 임시 이미지로 올리는 서비스 로직
   */
  uploadTmpImg(filename: string) {
    return this.tmpImgRepo.createTmpImg(filename);
  }

  /**
   *@description : 임시 이미지 파일 제거 스캐줄러
   */
  @Cron(CronExpression.EVERY_6_HOURS)
  removeTmpImgCrop() {
    this.tmpImgRepo.deleteAllTmpImg();
  }
}
