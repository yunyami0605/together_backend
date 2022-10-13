import { InternalServerErrorException } from '@nestjs/common';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from '../entity/user.entity';
import { ITmpSocialUser } from 'src/@types/user';

/**
 *@description : user api repository
 */
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
      throw new InternalServerErrorException(e);
    }
  }

  async createUser(body: CreateUserDto, file: Express.Multer.File) {
    try {
      const bcrypt = require('bcrypt');

      const hashedPassword = await bcrypt.hash(body.password, 12);

      const user = this.create({
        ...body,
        password: hashedPassword,
        imgPath: file.path,
      });

      await this.save(user);

      return user;
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }

  async createSocialUser(body: CreateUserDto, file: Express.Multer.File) {
    try {
      const dataSet = {
        ...body,
        imgPath: file.path,
      };

      const res = await this.createQueryBuilder()
        .update('user')
        .set({ ...dataSet })
        .where('socialID = :socialID and socialType = :socialType', {
          socialID: body.socialID,
          socialType: body.socialType,
        })
        .execute();

      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
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

  async updateUser(
    id: number,
    body: UpdateUserDto,
    file?: Express.Multer.File,
  ) {
    try {
      const dataSet = file
        ? {
            ...body,
            imgPath: file.path,
          }
        : body;

      await this.createQueryBuilder()
        .update('user')
        .set({ ...dataSet })
        .where('id = :id', { id })
        .execute();

      return id;
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }

  async removeUser(id: number) {
    try {
      await this.softDelete({ id });

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

  async checkSocialUser(socialType: string, socialID: string) {
    try {
      const result = await this.findOne({ socialType, socialID });

      const ret = {
        isNoDataUser: result?.socialID ? false : true,
        isNoRegisterUser: result?.nickname ? false : true,
        id: result?.id,
        email: result?.email,
      };

      return ret;
    } catch (error: any) {
      throw new InternalServerErrorException(error);
    }
  }

  async createTmpSocialUser(data: ITmpSocialUser) {
    try {
      const user = this.create(data);
      const result = await this.save(user);

      return result;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
