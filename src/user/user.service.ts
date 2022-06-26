import { HttpException, Injectable } from '@nestjs/common';
import { LoginUserDto } from 'src/study/board/dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  findList(page: number) {
    const countInPage = 3;
    return this.userRepo.findUserList(page, countInPage);
  }

  findOne(id: number) {
    return this.userRepo.findUser(id);
  }

  async create(body: CreateUserDto) {
    const isUserEmail = await this.userRepo.findEmail(body.email);
    const isUserNickname = await this.userRepo.findNickname(body.nickname);

    // @ 유저가 존재할 경우,
    if (isUserEmail)
      throw new HttpException('이미 존재하는 이메일입니다.', 403);
    if (isUserNickname)
      throw new HttpException('이미 존재하는 닉네임입니다.', 403);

    return this.userRepo.createUser(body);
  }

  update(id: number, body: UpdateUserDto) {
    return this.userRepo.updateUser(id, body);
  }

  remove(id: number) {
    return this.userRepo.removeUser(id);
  }

  login(body: LoginUserDto) {
    return this.userRepo.loginUser(body);
  }
}
