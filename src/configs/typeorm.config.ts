/* eslint-disable prettier/prettier */
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "src/users/entities/users.entity";

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1234',
  database: 'postsdb',
  entities: [__dirname + '/../**/*.entity.{js,ts}', User],
  synchronize: true,
};