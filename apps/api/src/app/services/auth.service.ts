import { Injectable } from '@nestjs/common';
import { AuthToken } from '@angular-nest-example/api-interfaces';
import { DatabaseService } from '../services/database.service';
import { environment } from '../../environments/environment';

const jwt = require('jsonwebtoken');

@Injectable()
export class AuthService {
  decoded: string;

  constructor(
    // private readonly db: DatabaseService,
  ) {}

  async createToken(
    userCode,
    password,
  ): Promise<AuthToken> {
    try {
      console.log('createToken(userCode:' + userCode + ', password:' + password);

      if (!userCode) {
        throw new Error('Invalid user code.');
      }

      // DB接続
      var db = new DatabaseService();
      await db.connect();

      // SQL実行
      const data = await db.query('SELECT * FROM users WHERE code = $1', [ userCode ]);

      // ユーザが見つからない場合はエラー
      if (data.rows.length === 0) {
        throw new Error('Invalid user code.');
      }

      // パスワード不一致の場合はエラー
      if (data.rows[0].password !== password) {
        throw new Error('Invalid id or password.');
      }

      const userId = data.rows[0].id;

      // アクセストークンの取得
      const accessToken = jwt.sign(
        { userId: userId },
        environment.tokenConf.accessTokenSecretKey,
        {
          algorithm: environment.tokenConf.algorithm,
          expiresIn: environment.tokenConf.accessTokenExpiresIn,
        });

      // リフレッシュトークンの取得
      const refreshToken = jwt.sign(
        { userId: userId },
        environment.tokenConf.refreshTokenSecretKey,
        {
          algorithm: environment.tokenConf.algorithm,
          expiresIn: environment.tokenConf.refreshTokenExpiresIn,
        });

      console.log('createToken() end');
      console.log(' userId:' + userId);
      console.log(' accessToken:' + accessToken);
      console.log(' refreshToken:' + refreshToken);
      return { userId: userId, accessToken: accessToken, refreshToken: refreshToken, message: null };
    } catch (e) {
      console.error(e.stack);
      return { message: e.message };
    } finally {
      await db.release();
    }
  }

  async refreshToken(
    userid,
    refreshToken,
  ): Promise<AuthToken> {
    try {
      console.log('refreshToken(refreshToken:' + refreshToken);

      // tokenがない場合、アクセスを拒否
      if (!refreshToken) {
        return { message: 'No token provided' };
      }
      // tokenが改ざんされていないかチェック
      try {
        const decoded = await jwt.verify(refreshToken, environment.tokenConf.refreshTokenSecretKey);
      } catch (e) {
        return { message: e.message };
      }

      // アクセストークンの取得
      const accessToken = jwt.sign(
        { userid: userid },
        environment.tokenConf.accessTokenSecretKey,
        {
          algorithm: environment.tokenConf.algorithm,
          expiresIn: environment.tokenConf.accessTokenExpiresIn,
        });

      console.log('refreshToken() end');
      console.log(' accessToken:' + accessToken);
      return { accessToken: accessToken, message: null };
    } catch (e) {
      console.error(e.stack);
      return { message: e.message };
    }
  }

  async verifyToken(
    accessToken,
  ): Promise<string> {
    if (!accessToken) {
      return 'No token provided';
    }
    try {
      this.decoded = await jwt.verify(accessToken, environment.tokenConf.accessTokenSecretKey);
      return null;
    } catch (e) {
      console.error(e.stack);
      return e.message;
    }
  }
}
