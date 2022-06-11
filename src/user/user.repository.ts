import { rmSync } from 'fs';
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

  async createUser(createUserDto: CreateUserDto) {
    const user = this.create(createUserDto);

    await this.save(user);

    return user;
  }

  async findEmail(email: string) {
    const res = await this.findOne({ where: { email } });

    return res;
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
