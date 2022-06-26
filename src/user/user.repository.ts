import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { LoginUserDto } from 'src/study/board/dto/login-user.dto';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  //
  async findUserList(page: number, countInPage: number) {
    try {
      const [list, count] = await this.createQueryBuilder('user')
        .offset((page - 1) * countInPage)
        .limit(page * countInPage)
        .getManyAndCount();

      return {
        list,
        count,
        lastPage: Math.ceil(count / countInPage),
      };
    } catch (e: any) {
      return null;
    }
  }

  async findUser(id: number) {
    try {
      const res = await this.findOne({ where: { id } });

      return res;
    } catch (e: any) {
      throw new InternalServerErrorException();
    }
  }

  async createUser({ email, password, nickname }: CreateUserDto) {
    try {
      const bcrypt = require('bcrypt');

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = this.create({
        email,
        password: hashedPassword,
        nickname,
      });

      await this.save(user);

      return user;
    } catch (e: any) {
      throw new InternalServerErrorException();
    }
  }

  async findEmail(email: string) {
    try {
      const res = await this.findOne({ where: { email } });

      return res;
    } catch (e: any) {
      throw new InternalServerErrorException();
    }
  }

  async findNickname(nickname: string) {
    try {
      const res = await this.findOne({ where: { nickname } });

      return res;
    } catch (e: any) {
      throw new InternalServerErrorException();
    }
  }

  async loginUser({ email, password }: LoginUserDto) {
    // const res = await this.findEmail(email);
    try {
      const res = await this.findOne({
        where: { email },
        select: ['id', 'email', 'password'],
      });

      return res;
    } catch (e: any) {
      throw new InternalServerErrorException();
    }
  }

  async updateUser(id: number, body: UpdateUserDto) {
    try {
      const res = await this.createQueryBuilder()
        .update('user')
        .set(body)
        .where('id = :id', { id })
        .execute();

      return id;
    } catch (e: any) {
      throw new InternalServerErrorException();
    }
  }

  async removeUser(id: number) {
    try {
      const res = await this.softDelete({ id });

      return id;
    } catch (e: any) {
      throw new InternalServerErrorException();
    }
  }
}
