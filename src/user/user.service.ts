import { HttpException, Injectable } from '@nestjs/common';
import { ITmpSocialUser } from 'src/@types/user';
import { deleteFile } from 'src/tool';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';

/**
 *@description : user api service logic
 */
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

  async create(body: CreateUserDto, file?: Express.Multer.File) {
    const isUserEmail = await this.userRepo.findEmail(body.email);
    const isUserNickname = await this.userRepo.findNickname(body.nickname);

    console.log('@@@ SOCIAL USESR CREATE');
    console.log('@@@ SOCIAL USESR CREATE');
    console.log(body);

    // @ 유저가 존재할 경우,
    if (isUserEmail)
      throw new HttpException('이미 존재하는 이메일입니다.', 403);
    if (isUserNickname)
      throw new HttpException('이미 존재하는 닉네임입니다.', 403);

    if (body.socialID) return this.userRepo.createSocialUser(body, file);
    else {
      return this.userRepo.createUser(body, file);
    }
  }

  async update(id: number, body: UpdateUserDto, file?: Express.Multer.File) {
    const userData = await this.userRepo.findUser(id);

    if (file && userData.imgPath !== file.filename) {
      deleteFile(userData.imgPath, (err) => console.log(err));
    }

    return this.userRepo.updateUser(id, body, file);
  }

  remove(id: number) {
    return this.userRepo.removeUser(id);
  }

  createTmpSocialUser(data: ITmpSocialUser) {
    return this.userRepo.createTmpSocialUser(data);
  }
}
