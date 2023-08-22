# Angular + Nest Example2

Angular、NestJSを使用したサンプル画面です。  
DBはPostgreSQLを使用しています。  
最低限の構成で、簡単なCRUD機能を実現しています。  

![angular-nest-example2](https://user-images.githubusercontent.com/61641646/211228655-6bf82542-1911-44ba-a204-0be7270f012d.png)

## 動作確認環境

・node.js　　　 16.12.0  
・npm　　　　　　8.1.0  
・PostgreSql　　15.1  
・ブラウザ　　　 Chrome、Edge

## DBの準備
DBは、PostgreSqlを適当にインストールし、テスト用のテーブル、初期ユーザを作成してください。

・テーブル作成
```
-- ユーザテーブル
# CREATE TABLE users (id serial, code varchar(50), name varchar(50), age int, sex int, birthday timestamptz, password varchar(128), note varchar(256), auth jsonb, PRIMARY KEY(code));
-- 入退室管理テーブル
# CREATE TABLE room_access_mng (id serial, room_cd varchar(10), user_id int, entry_dt timestamptz, exit_dt timestamptz, note varchar(256), image_file text);
```

・初期ユーザ作成
```
# INSERT INTO users (code, name, password, note, auth) VALUES ('admin', 'admin','ba3253876aed6bc22d4a6ff53d8406c6ad864195ed144ab5c87621b6c233b548baeae6956df346ec8c17f5ea10f35ee3cbc514797ed7ddd3145464e2a0bab413', 'password:123456', '[10, 11, 12, 13, 20, 21, 22, 23]');
# INSERT INTO users (code, name, password, note, auth) VALUES ('guest', 'guest','ba3253876aed6bc22d4a6ff53d8406c6ad864195ed144ab5c87621b6c233b548baeae6956df346ec8c17f5ea10f35ee3cbc514797ed7ddd3145464e2a0bab413', 'password:123456', '[20, 21, 22, 23]');
```

DBのタイムゾーンを変更してください。
```
ALTER DATABASE データベース名 SET timezone TO 'Asia/Tokyo';
```

・接続設定  
接続の設定は、以下のように環境変数をセットしてください。  
（以下はwindowsの例です。）
```
setx DB_HOST localhost
setx DB_NAME postgres
setx DB_USER postgres
setx DB_PASSWORD postgres
setx DB_PORT 5432
setx DB_SSL false
```
あるいは、apps\api\src\environments\environment.ts の以下の部分を書き換えることもできます。  
（環境変数がセットされていない場合はこちらが使用されます。）
```
  pgConf: {
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    ssl: false,
  },
```

## 実行方法
・npmパッケージのインストール
```
$ npm install
```

・ビルド
```
$ npm run build
```

・開発環境での起動

```
$ npm start
```

※ 「Launch Chrome」で Chrome が起動します。これでフロントエンドのデバッグができます。  
※ バックエンドのデバッグがしたい場合、「Attach Node」でnodeのプロセスにアタッチしてください。

## herokuでの実行

以下の設定が必要です。

・devDependenciesのmoduleもインストールする。
```
heroku config:set NPM_CONFIG_PRODUCTION=false --app XXXXXXXXXXXX
```

・DBの設定を変更する
```
heroku config:set DB_USER=XXXXXXXXXX --app XXXXXXXXXXXX
heroku config:set DB_PASSWORD=XXXXXXXXXX --app XXXXXXXXXXXX
heroku config:set DB_HOST=XXXXXXXXXX --app XXXXXXXXXXXX
heroku config:set DB_PORT=XXXXXXXXXX --app XXXXXXXXXXXX
heroku config:set DB_NAME=XXXXXXXXXX --app XXXXXXXXXXXX
```

・タイムゾーンの設定
```
# alter database XXXXXXXXXX set timezone = 'Asia/Tokyo';
```

## renderでの実行
ビルドコマンドは、以下のようにインストールとビルドを両方行うようにします。
```
$ npm install && npm run build
```
