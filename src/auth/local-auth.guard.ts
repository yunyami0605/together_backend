import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// id, password로 접근한 사항들
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest(err, user, info) {
    console.log('@@@ handle');
    console.log(user);
    console.log(info);
    console.log(err);

    return user;
  }
}
