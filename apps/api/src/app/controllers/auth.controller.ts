import { Controller, Post, Request, Body } from '@nestjs/common';
import { AuthToken } from '@angular-nest-example/api-interfaces';
import { AuthService } from '../services/auth.service';

const jwt = require('jsonwebtoken');

@Controller()
export class AuthController {
  constructor(
    private readonly auth: AuthService,
  ) {}

  @Post('createToken')
  async createToken(
    @Body() body: any,
  ): Promise<AuthToken> {
    return await this.auth.createToken(
      body.userid,
      body.password,
    );
  }

  @Post('refreshToken')
  async refreshToken(
    @Request() req: Request,
    @Body() body: any,
  ): Promise<AuthToken> {
    return await this.auth.refreshToken(
      body.userid,
      req.headers['refresh-token'],
    );
  }
}
