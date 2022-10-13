import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { AuthService } from '../auth.service';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.NAVER_REST_API_KEY,
      callbackURL: process.env.NAVER_LOGIN_CALLBACK_URL,
      clientSecret: process.env.NAVER_SECRET_KEY,
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
