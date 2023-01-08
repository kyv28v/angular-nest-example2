import { Controller, Post, Request, Body } from '@nestjs/common';
import { AuthToken } from '@angular-nest-example/api-interfaces';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';

const jwt = require('jsonwebtoken');

@Controller()
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    // private readonly db: DatabaseService,
  ) {}

  @Post('createToken')
  async createToken(
    @Body() body: any,
  ): Promise<AuthToken> {
    return await this.auth.createToken(
      body.userCode,
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

  @Post('changePassword')
  async changePassword(
    @Body() body: any,
  ) {
    try {
      console.log('changePassword() start');
      console.log('userId:' + body.userId);
      // console.log('oldPassword:' + req.body.oldPassword);
      // console.log('newPassword:' + req.body.newPassword);

      // connect db
      var db = new DatabaseService();
      await db.connect();

      // execute query
      const data = await db.query('SELECT * FROM users WHERE id = $1', [ body.userId ]);

      // Error if user not found
      if (data.rows.length === 0) {
          throw new Error('ユーザ情報の取得に失敗しました。');
      }

      // Error if password mismatch
      if (data.rows[0].password !== body.oldPassword) {
          throw new Error('以前のパスワードが不正です。');
      }

      // execute query
      await db.begin();
      const ret = await db.query('UPDATE users SET password = $1 WHERE id = $2', [ body.newPassword, body.userId ]);
      await db.commit();

      console.log('changePassword() end');
      return { message: null };
    } catch (e) {
      console.log(e.stack);
      await db.rollback();
      return { message: e.message };
    } finally {
      await db.release();
    }
  }
}
