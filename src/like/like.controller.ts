import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { TRequest } from 'src/@types/common';

/**
 *@description : board like api controller
 */
@Controller('api/like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: CreateLikeDto, @Req() req: TRequest) {
    return this.likeService.create(body, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.likeService.remove(+id);
  }

  @Get('/list')
  findAll(@Query() query: { board_id: string; user_id: string }) {
    return this.likeService.findAll(query);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLikeDto: UpdateLikeDto) {
    return this.likeService.update(+id, updateLikeDto);
  }
}
