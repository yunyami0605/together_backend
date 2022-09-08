import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudyModule } from './study/study.module';
import { typeORMConfig } from '../ormconfig';
import { BoardModule } from './study/board/board.module';
import { StudyBoardEntity } from './entity/board.entity';
import { UserModule } from './user/user.module';
import { UserEntity } from './entity/user.entity';
import { LoggerMiddleware } from './middleware/logger.middleware';
// import { WinstonModule } from 'nest-winston';
// import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { ExampleMiddleware } from './middleware/example.middleware';
import { CommentModule } from './comment/comment.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CommentEntity } from './entity/comment.entity';
import { BoardMemberEntity } from './entity/boardMember.entity';
import { LikeModule } from './like/like.module';
import { LikeEntity } from './entity/like.entity';
import { TmpImageEntity } from './entity/tmpImg.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),

    StudyModule,
    ConfigModule.forRoot(),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', '..', 'files'),
    // }),

    // ServeStaticModule.forRoot({
    //   serveRoot: '/path1',
    //   rootPath: `/var/lib/app/data1`,
    // }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_URL,
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        __dirname + '/../**/*.entity{.ts,.js}',
        // __dirname + '/src/**/*.entity.{js,ts}',
        StudyBoardEntity,
        UserEntity,
        CommentEntity,
        BoardMemberEntity,
        LikeEntity,
        TmpImageEntity,
      ],
      timezone: 'Z',
      synchronize: false,
      autoLoadEntities: true,
    }),
    UserModule,
    AuthModule,
    CommentModule,
    LikeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    // consumer.apply(LoggerMiddleware, ExampleMiddleware).forRoutes('*');
  }
}
