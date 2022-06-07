import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  findList(page: number) {
    const countInPage = 4;
    return this.userRepo.findUserList(page, countInPage);
  }

  findOne(id: number) {
    return this.userRepo.findUser(id);
  }

  async create(body: CreateUserDto) {
    const isUser = await this.userRepo.findEmail(body.email);

    // @ 유저가 존재할 경우,
    if (isUser) throw new HttpException('User is already existed', 403);

    return this.userRepo.createUser(body);
  }

  update(id: number, body: UpdateUserDto) {
    return this.userRepo.updateUser(id, body);
  }

  remove(id: number) {
    return this.userRepo.deleteUser(id);
  }
}
