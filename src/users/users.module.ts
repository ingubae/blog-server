import { Module, forwardRef } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/users.entity";
import { AuthModule } from "src/auth/auth.module";
import { TypeOrmExModule } from "./repository/typeorm-ex.module";
import { UserRepository } from "./repository/user.repository";
import { ScheduleModule } from "@nestjs/schedule";
// import { AuthService } from "src/auth/auth.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        TypeOrmExModule.forCustomRepository([UserRepository]),
        forwardRef(() => AuthModule),
        ScheduleModule.forRoot(),
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService, TypeOrmModule, TypeOrmExModule],
})
export class UsersModule {}
