export const environment = {
  production: false,
  // PostgreSQLの接続設定
  pgConf: {
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    ssl: false,
  },
  // アクセストークンの設定
  tokenConf: {
    algorithm: 'HS256',
    accessTokenExpiresIn: '30m',          // 有効期限：30分
    refreshTokenExpiresIn: '180 days',    // 有効期限：180日
    accessTokenSecretKey: 'Sv3tnH9pe6DT4Vm9G7UzmDmyM2qTWE38',
    refreshTokenSecretKey: '9JYZxaQfdCjX8iHDC5MLmmv2TgYQLdRv',
  }
};
