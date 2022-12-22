import { Injectable } from '@nestjs/common';

import { environment } from '../../environments/environment';

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || environment.pgConf.user,
  password: process.env.DB_PASSWORD || environment.pgConf.password,
  host: process.env.DB_HOST || environment.pgConf.host,
  port: process.env.DB_PORT || environment.pgConf.port,
  database: process.env.DB_NAME || environment.pgConf.database,
  ssl: ((process.env.DB_SSL && process.env.DB_SSL.toLowerCase() == 'true') || environment.pgConf.ssl == true)
    ? { rejectUnauthorized: false } : false,
});

@Injectable()
export class DatabaseService {
  private client: any;

  async connect() {
    this.client = await pool.connect();
  }

  async release() {
    if (this.client) { await this.client.release(true); }
  }

  async query(text: string, values: any) {
    // console.log('Postgres.query(' + text + ',' + values + ')');
    const ret = await this.client.query(text, values);
    return ret;
  }

  async begin() {
    await this.client.query('BEGIN');
  }

  async commit() {
    await this.client.query('COMMIT');
  }

  async rollback() {
    await this.client.query('ROLLBACK');
  }
}
