import { rmSync } from 'fs';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  //
  async findUserList(page: number, countInPage: number) {
    const res = await this.createQueryBuilder('user')
      .limit(page * countInPage)
      .skip((page - 1) * countInPage)
      // .where('studyBoard.id = :id', { id: 1 })
      .getMany();

    return res;
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

    console.log(res);

    return id;
  }

  async deleteUser(id: number) {
    const res = await this.softDelete({ id });

    return id;
  }
}
