import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

/*
  guard에서 실행되는 로직 스크립트 // id, password로 api 요청 시, 대표 적 로그인 
*/
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(userEmail: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(userEmail, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
