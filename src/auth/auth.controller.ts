import { Controller, Post, UseGuards, Request, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

/**
 *@description : login, logout auth api controller
 */
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req, @Response() res) {
    return this.authService.login(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@Request() req, @Response() res) {
    return this.authService.logout(res, req.user?.userId);
  }
}
