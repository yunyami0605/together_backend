import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import dotenv from 'dotenv';
import { StudyBoardEntity } from 'src/entity/board.entity';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  // host: process.env.DATABASE_URL,
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '../**/*.entity.{js,ts}'],
  //   entities: [StudyBoardEntity],

  synchronize: true,
};

// // dotenv.config();
// const config: TypeOrmModuleOptions = {
//   type: 'mysql',
//   host: process.env.DATABASE_URL,
//   port: 3306,
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   entities: [StudyBoardEntity],
//   //   entities: [__dirname + '/../**/*.entity.{js,ts}'],

//   migrations: [__dirname + '/src/migrations/*.ts'],
//   cli: { migrationsDir: 'src/migrations' },
//   autoLoadEntities: true,
//   charset: 'utf8mb4',
//   synchronize: false,
//   logging: true,
//   keepConnectionAlive: true,
// };
