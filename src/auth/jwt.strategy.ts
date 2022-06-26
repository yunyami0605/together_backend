import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

const jwtConstants = {
  secret: 'secretKey', // token 발급 시 사용되는 시크릿 키. 노출되면 안됨.
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Request에서 JWT를 추출하는 방법 중 Bearer Token 사용
      ignoreExpiration: false, // jwt 보증을 passport 모듈에 위임함. 만료된 JWT인경우 request거부, 401 response
      secretOrKey: jwtConstants.secret, // token 발급에 사용할 시크릿 키
    });
  }

  async validate(payload: any) {
    /**
     * email: 'test4@test.com'
     * sub: 9
     * iat: 1655820052
     * exp: 1655834452
     * */
    console.log('@ JWT');
    console.log(payload);
    return { userId: payload.sub, userEmail: payload.email };
  }
}
