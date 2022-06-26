import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from 'src/study/board/dto/login-user.dto';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('user api')
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'user create api', description: 'create user' })
  @Get('/list')
  findList(@Query('page') page: string) {
    return this.userService.findList(+page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Post()
  create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
