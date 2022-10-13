import { HttpService } from '@nestjs/axios';
import {
  ForbiddenException,
  HttpException,
  Injectable,
  Request,
  Response,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { UserEntity } from 'src/entity/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { AxiosResponse } from 'axios';
import { ISocialLoginBody } from 'src/@types/user';

/**
 *@description : login, logout auth api service logic
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  /**
   *@description email, password login 체크
   */
  async validateUser(email: string, password: string) {
    const user = await this.userRepo.loginUser({ email, password });

    if (user) {
      const bcrypt = require('bcrypt');

      const result = await bcrypt.compare(password, user.password);

      if (result) {
        return user;
      } else {
        throw new ForbiddenException('잘못된 패스워드입니다.');
      }
    } else {
      throw new ForbiddenException('잘못된 이메일 패스워드입니다.');
    }
  }

  /**
   *@description 등록된 social 유저인지 check
   *@param {}  -
   */
  checkSocialUser(socialType: string, socialID: string) {
    return this.userRepo.checkSocialUser(socialType, socialID);
  }

  async socialLogin(payload: ISocialLoginBody, @Response() res) {
    const token = this.jwtService.sign(payload);

    // # httpOnly 부분 해결법 생각해보기
    const cookie = `toat=${token}; ${
      process.env.NODE_ENV !== 'production' ? '' : 'HttpOnly;'
    }secure; samesite=lax; Path=/; Max-Age=${3600}`;

    res.setHeader('Set-Cookie', cookie);
    return res.redirect(`${process.env.CLIENT_URL_DOMAIN}/study`);
  }

  async login(@Request() req, @Response() res) {
    const { user }: { user: UserEntity } = req;

    const payload = { email: user.email, sub: user.id };

    const token = this.jwtService.sign(payload);

    // # httpOnly 부분 해결법 생각해보기
    const cookie = `toat=${token}; ${
      process.env.NODE_ENV !== 'production' ? '' : 'HttpOnly;'
    }secure; samesite=lax; Path=/; Max-Age=${3600}`;

    res.setHeader('Set-Cookie', cookie);

    user.password = undefined;
    return res.send({
      statusCode: 204,
      data: token,
    });
  }

  async logout(@Response() res, id?: number) {
    if (!id) throw new HttpException('Not Access Authorization ', 403);

    // # httpOnly 부분 해결법 생각해보기
    const cookie = `toat=; ${
      process.env.NODE_ENV !== 'production' ? '' : 'HttpOnly;'
    }secure; samesite=lax; Path=/; Max-Age=${0}`;

    res.setHeader('Set-Cookie', cookie);

    return res.send({
      statusCode: 204,
      data: '',
    });
  }

  async loginKakao(body: any): Promise<AxiosResponse<any, any>> {
    const res = await firstValueFrom(
      this.httpService.get(`https://kapi.kakao.com/v2/user/me`, {
        headers: { Authorization: `bearer ${body.access_token}` },
      }),
    );

    /**
        id: 2469890403,
        connected_at: '2022-10-09T06:13:30Z',
        properties: { nickname: '종윤' },
        kakao_account: {
          profile_nickname_needs_agreement: false,
          profile: { nickname: '종윤' },
          has_gender: true,
          gender_needs_agreement: false,
          gender: 'male'
        }
     */

    return res;
  }

  async getOauthToken(code: string) {
    const REST_API_KEY = '97598f876fed89fe6dc07b58034b0491';
    const REDIRECT_URI = 'http://localhost:3000/api/auth/kakao/redirect';
    const AUTHORIZE_CODE = code;

    const res = this.httpService.post(
      'http://localhost:3000/oauth/token',
      `grant_type=authorization_code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&code=${AUTHORIZE_CODE}`,
      {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      },
    );

    console.log(res);
    return 1;
  }
}
