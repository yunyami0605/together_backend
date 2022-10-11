import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from 'src/user/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './authContant';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { HttpModule } from '@nestjs/axios';
import { KakaoStrategy } from './kakao.strategy';
import { UserService } from 'src/user/user.service';

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
    UserService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
