import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 *@description : user api module
 */
@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
