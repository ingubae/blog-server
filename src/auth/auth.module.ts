import { Module, forwardRef } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import { UsersModule } from "src/users/users.module";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { LocalStrategy } from "./local/local.strategy";
import { JwtStrategy } from "./jwt/jwt.strategy";
import { jwtConstants } from "./constants";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/entities/users.entity";
import { TypeOrmExModule } from "src/users/repository/typeorm-ex.module";
import { UserRepository } from "src/users/repository/user.repository";
import { JwtRefreshStrategy } from "./jwt/jwt-refresh.strategy";
// import { AuthGuard } from "./auth.guard";
// import { APP_GUARD } from "@nestjs/core";
// import { JwtAuthGuard } from "./jwt/jwt.guard";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        TypeOrmExModule.forCustomRepository([UserRepository]),

        forwardRef(() => UsersModule),
        PassportModule.register({
            defaultStrategy: "jwt",
            // session: true,
        }),
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: `${jwtConstants.expiry}` },
            // signOptions: { expiresIn: "60s" },
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        JwtRefreshStrategy,
        // { provide: APP_GUARD, useClass: JwtAuthGuard }, // for global guard
    ],
    exports: [AuthService],
})
export class AuthModule {}
