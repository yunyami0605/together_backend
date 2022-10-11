import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { AuthService } from './auth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.KAKAO_REST_API_KEY,
      callbackURL: process.env.KAKAO_LOGIN_CALLBACK_URL,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ) {
    console.log('@@@ PROFILE INNER');
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);

    const payload = {
      accessToken,
      refreshToken,
      profile,
    };
    done(null, payload);
  }
}
