import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AuthController } from './controllers/auth.controller';
import { QueryController } from './controllers/query.controller';

import { AppService } from './app.service';
import { DatabaseService } from './services/database.service';
import { AuthService } from './services/auth.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    AuthController,
    QueryController,
  ],
  providers: [
    AppService,
    DatabaseService,
    AuthService,
  ],
})
export class AppModule {}
