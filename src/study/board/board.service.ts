import { Injectable } from '@nestjs/common';

@Injectable()
export class BoardService {
  getBoardList(page: number) {
    return `@ board get list ${page}`;
  }

  getBoard() {
    return `@ board get`;
  }

  registerBoard() {
    return `@ board register`;
  }

  updateBoard() {
    return `@ board update`;
  }

  deleteBoard() {
    return `@ board delete`;
  }
}
