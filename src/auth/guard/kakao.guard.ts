import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class KakaoAuthGuard extends AuthGuard('kakao') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: any, status?: any) {
    console.log('@@@ handle');
    console.log(err);

    if (err) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
