import { Module, forwardRef } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import { UsersModule } from "src/users/users.module";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt/jwt.strategy";
import { AuthController } from "./auth.controller";
import { jwtConstants } from "./constants";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./auth.guard";

@Module({
    imports: [
        forwardRef(() => UsersModule),
        PassportModule.register({ defaultStrategy: "jwt", session: false }),
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: 3600 },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, { provide: APP_GUARD, useClass: AuthGuard }],
    exports: [AuthService],
})
export class AuthModule {}
