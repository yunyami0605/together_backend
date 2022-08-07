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
import { UserEntity } from '../entity/user.entity';

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
      // const res = await this.createQueryBuilder('u')
      // .select([
      //   'u.id',
      //   'u.email',
      //   'u.nickname',

      // ])

      return res;
    } catch (e: any) {
      throw new InternalServerErrorException(e);
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
      throw new InternalServerErrorException(e);
    }
  }

  async findEmail(email: string) {
    try {
      const res = await this.findOne({ where: { email } });

      return res;
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }

  async findNickname(nickname: string) {
    try {
      const res = await this.findOne({ where: { nickname } });

      return res;
    } catch (e: any) {
      throw new InternalServerErrorException(e);
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
      throw new InternalServerErrorException(e);
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
      throw new InternalServerErrorException(e);
    }
  }

  async removeUser(id: number) {
    try {
      const res = await this.softDelete({ id });

      return id;
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }

  async getBoardMember(boardId: number) {
    try {
      const result = await this.createQueryBuilder('u')
        .select(['u.id', 'u.nickname'])
        .innerJoin('u.boardMembers', 'members')
        .innerJoin('members.boardId', 'board', 'board.id = :id', {
          id: boardId,
        })
        .getMany();

      return result;
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }
}
