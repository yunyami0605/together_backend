import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from 'src/user/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './authContant';
import { HttpModule } from '@nestjs/axios';
import { UserService } from 'src/user/user.service';
import { LocalStrategy } from './guard/local.strategy';
import { JwtStrategy } from './guard/jwt.strategy';
import { KakaoStrategy } from './guard/kakao.strategy';
import { NaverStrategy } from './guard/naver.strategy';
import { GoogleStrategy } from './guard/google.strategy';

/**
 *@description : login, logout auth api module
 */
@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([UserRepository]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '4h' },
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    KakaoStrategy,
    NaverStrategy,
    GoogleStrategy,
    UserService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
