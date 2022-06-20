import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userRepo.findOne(email);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { userEmail: user.userEmail, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  //   async validateUser(email: string, password: string) {
  //     const user = await this.usersRepository.findOne({
  //       where: { email },
  //       select: ['id', 'email', 'password'],
  //     });
  //     console.log(email, password, user);
  //     if (!user) {
  //       return null;
  //     }
  //     const result = await bcrypt.compare(password, user.password);
  //     if (result) {
  //       const { password, ...userWithoutPassword } = user;
  //       return userWithoutPassword;
  //     }
  //     return null;
  //   }
}
