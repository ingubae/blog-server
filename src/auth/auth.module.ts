import { Module, forwardRef } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import { UsersModule } from "src/users/users.module";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./local/local.strategy";
import { JwtStrategy } from "./jwt/jwt.strategy";
import { AuthController } from "./auth.controller";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./jwt/jwt.guard";
import { jwtConstants } from "./constants";
// import { AuthGuard } from "./auth.guard";

@Module({
    imports: [
        forwardRef(() => UsersModule),
        PassportModule.register({
            // defaultStrategy: "jwt",
            session: true,
        }),
        JwtModule.register({
            // global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: "300s" },
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        { provide: APP_GUARD, useClass: JwtAuthGuard },
    ],
    exports: [AuthService],
})
export class AuthModule {}
