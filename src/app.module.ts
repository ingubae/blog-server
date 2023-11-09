/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

// import { PostsModule } from "./posts/posts.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "./configs/ormconfig";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot(typeOrmConfig),
        UsersModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
