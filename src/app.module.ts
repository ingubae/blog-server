/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

// import { PostsModule } from "./posts/posts.module";
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "./configs/typeorm.config"

@Module({
    imports: [TypeOrmModule.forRoot(typeOrmConfig), UsersModule, ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
