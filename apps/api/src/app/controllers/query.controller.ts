import { Controller, Get, Post, Query, Request, Res, Body, HttpStatus, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { QueryResult } from '@angular-nest-example/api-interfaces';
import { DatabaseService } from '../services/database.service';
import { AuthService } from '../services/auth.service';

const jwt = require('jsonwebtoken');

const fs = require('fs')

@Controller()
export class QueryController {
  constructor(
    // private readonly db: DatabaseService,
    private readonly auth: AuthService,
  ) {}


  @Get('query')
  async getQuery(
    @Request() req: Request,
    @Res() res: Response,
    @Query() query: any,
  ) {
    try {
      console.log('getQuery(' + JSON.stringify(query) + ')');
      console.log(' sql:' + query.sql);
      console.log(' values:' + query.values);

      // トークンの正常チェック
      const verifyToken = await this.auth.verifyToken(req.headers['access-token']);
      if(verifyToken) {
        res.status(HttpStatus.UNAUTHORIZED);
        res.json({message: verifyToken});
        return;
      }

      const sql = fs.readFileSync('./apps/api/src/assets/sqls/' + query.sql, 'utf-8');
      console.log(sql);

      // SQL実行
      const values = JSON.parse(query.values + '');
      const data = await this.query(sql, values, false);

      console.log('getQuery() end');
      console.log(' data:' + JSON.stringify(data.rows));
      res.json({rows: data.rows, message: null});
      return;
    } catch (e) {
      console.error(e.stack);
      res.json({rows: null, message: e.message});
      return;
    }
  }

  @Post('query')
  async postQuery(
    @Request() req: Request,
    @Res() res: Response,
    @Body() body: any,
  ) {
    try {
      console.log('postQuery(' + JSON.stringify(body) + ')');
      console.log(' sql:' + body.sql);
      console.log(' values:' + body.values);

      // トークンの正常チェック
      const verifyToken = await this.auth.verifyToken(req.headers['access-token']);
      if(verifyToken) {
        res.status(HttpStatus.UNAUTHORIZED);
        res.json({message: verifyToken});
        return;
      }

      const sql = fs.readFileSync('./apps/api/src/assets/sqls/' + body.sql, 'utf-8');
      console.log(sql);

      // SQL実行
      const data = await this.query(sql, body.values, true);

      console.log('postQuery() end');
      console.log(' data:' + JSON.stringify(data.rows));
      res.json({rows: data.rows, message: null});
      return;
    } catch (e) {
      console.error(e.stack);
      res.json({rows: null, message: e.message});
      return;
    }
  }

  async query(sql: string, values: any[], trans: boolean) {
    try {
      // console.log('db.query() start');
      // console.log('sql:' + sql);
      // console.log('values:' + JSON.stringify(values));

      // DB接続
      var db = new DatabaseService();
      await db.connect();

      // SQL実行
      if (trans) { await db.begin(); }
      const data = await db.query(sql, values);
      if (trans) { await db.commit(); }

      // console.log('db.query() end');
      // console.log('data:' + JSON.stringify(data.rows));
      return data;
    } catch (e) {
      if (trans) { await db.rollback(); }
      throw e;
    } finally {
      await db.release();
    }
  }
}
