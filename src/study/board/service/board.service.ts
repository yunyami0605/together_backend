import { Injectable } from '@nestjs/common';
import { RegisterBoardDto } from '../dto/create-board.dto';

@Injectable()
export class BoardService {
  getBoardList(page: number) {
    return `@ board get list ${page}`;
  }

  getBoard() {
    return `@ board get`;
  }

  registerBoard(body: RegisterBoardDto) {
    return `@ board register ${body.id} ${body.title}`;
  }

  updateBoard() {
    return `@ board update`;
  }

  deleteBoard() {
    return `@ board delete`;
  }
}
