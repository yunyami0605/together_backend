import {
  ForbiddenException,
  Injectable,
  Request,
  Response,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

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

  async login(@Request() req, @Response() res) {
    const { user }: { user: UserEntity } = req;

    const payload = { email: user.email, sub: user.id };

    const token = this.jwtService.sign(payload);
    const cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${3600}`;

    res.setHeader('Set-Cookie', cookie);
    user.password = undefined;
    return res.send({
      success: true,
    });
  }
}
