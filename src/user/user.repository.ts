import { BadRequestException, ForbiddenException } from '@nestjs/common';
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
    const res = await this.findOne({ where: { id } });

    return res;
  }

  async createUser({ email, password, nickname }: CreateUserDto) {
    const res = await this.findEmail(email);

    if (res) {
      throw new ForbiddenException('이미 존재하는 이메일입니다.');
    }

    const bcrypt = require('bcrypt');

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = this.create({
      email,
      password: hashedPassword,
      nickname,
    });

    await this.save(user);

    return user;
  }

  async findEmail(email: string) {
    const res = await this.findOne({ where: { email } });

    return res;
  }

  async loginUser({ email, password }: LoginUserDto) {
    // const res = await this.findEmail(email);

    const res = await this.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });

    if (res) {
      const bcrypt = require('bcrypt');

      const result = await bcrypt.compare(password, res.password);

      return result;
    } else {
      throw new ForbiddenException('잘못된 이메일 패스워드입니다.');
    }
  }

  async updateUser(id: number, body: UpdateUserDto) {
    const res = await this.createQueryBuilder()
      .update('user')
      .set(body)
      .where('id = :id', { id })
      .execute();

    return id;
  }

  async removeUser(id: number) {
    const res = await this.softDelete({ id });

    return id;
  }
}
