import {
  Controller,
  Post,
  UseGuards,
  Request,
  Response,
  Get,
  Param,
  Body,
  Req,
  Res,
  HttpException,
} from '@nestjs/common';
import { ISocialLoginBody, ITmpSocialUser } from 'src/@types/user';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { KakaoAuthGuard } from './kakao.guard';
import { LocalAuthGuard } from './local-auth.guard';

/**
 *@description : login, logout auth api controller
 */
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  /**
   *@description 일반 email, password 로그인
   */
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req, @Response() res) {
    return this.authService.login(req, res);
  }

  /**
   *@description 로그아웃 로직
   */
  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@Request() req, @Response() res, @Body() body) {
    return this.authService.logout(res, req.user?.userId);
  }

  @UseGuards(KakaoAuthGuard)
  @Get('/login/kakao')
  loginKakao() {
    console.log('KAKAO LOGIN COMPLETE');
    return 1;
  }

  // /login/kakao/redirect
  @UseGuards(KakaoAuthGuard)
  @Get('/login/kakao/redirect')
  async loginKakaoCallback(@Req() req, @Response() res) {
    console.log('@@@ KAKAO LOGIN CALLBACK');

    const { accessToken, refreshToken, profile } = req.user;

    if (profile.id) {
      const { isNoDataUser, isNoRegisterUser, id, email } =
        await this.authService.checkSocialUser(profile.provider, profile.id);

      if (isNoRegisterUser) {
        // 소셜 회원이 아닐 경우, 임시 회원 생성 후, 회원가입 페이지로 리다이랙트
        console.log('GO REGISTER');
        const createUserData: ITmpSocialUser = {
          socialID: profile.id,
          socialType: profile.provider,
          accessToken,
          refreshToken,
        };

        if (isNoDataUser) this.userService.createTmpSocialUser(createUserData);
        res.redirect(
          `${process.env.CLIENT_URL_DOMAIN}/user/register?social_id=${profile.id}&social_type=${profile.provider}`,
        );

        return 1;
      } else {
        // 소셜 회원일 경우, 토큰 부여
        const createUserData: ISocialLoginBody = {
          sub: id,
          email,
        };

        return this.authService.socialLogin(createUserData, res);
      }
    }
    // social login 인증이 안될 경우,

    throw new HttpException('NOT SOCIAL AUTHORIZED', 401);
  }
}
