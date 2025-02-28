import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';  // Importáld a ServeStaticModule-ot
import * as path from 'path';  // Az elérési utak kezeléséhez
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    UsersModule,
    BooksModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),  // A public mappa elérési útja
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
