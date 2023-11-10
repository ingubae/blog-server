import { Module, forwardRef } from "@nestjs/common";
import { TwoFactorAuthController } from "./2fa.controller";
import { TwoFactorAuthService } from "./2fa.service";
import { UsersModule } from "src/users/users.module";
import { AuthModule } from "src/auth/auth.module";
import { JwtStrategy } from "src/auth/jwt/jwt.strategy";
import { JwtTFAStrategy } from "./jwt/jwt-tfa.strategy";

@Module({
    imports: [forwardRef(() => UsersModule), AuthModule],
    controllers: [TwoFactorAuthController],
    providers: [TwoFactorAuthService, JwtStrategy, JwtTFAStrategy],
    exports: [TwoFactorAuthService],
})
export class TwoFAModule {}
