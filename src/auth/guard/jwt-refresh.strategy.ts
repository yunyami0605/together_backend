import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private readonly usersService: UserService) {
    super({
      // jwtFromRequest: ExtractJwt.fromExtractors([
      //   (request) => {
      //     console.log(request?.cookies);
      //     return request?.cookies?.together_rt;
      //   },]),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      secretOrKey: process.env.REFRESH_TOKEN_SECRET_KEY,
      passReqToCallback: true,
    });
  }

  async validate(req, payload: any) {
    const refreshToken = req.cookies?.Refresh;
    console.log(refreshToken);
    console.log(req.cookies);

    return 1;
    // return this.usersService.getUserIfRefreshTokenMatches(
    //   refreshToken,
    //   payload.id,
    // );
  }
}
