import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { ContextIdFactory, ModuleRef } from "@nestjs/core";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService,
        private moduleRef: ModuleRef
    ) {
        super({
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
        });
    }

    async validate(request: Request, email: string, password: string): Promise<any> {
        const contextId = ContextIdFactory.getByRequest(request);
        // "AuthService" is a request-scoped provider
        const authService = await this.moduleRef.resolve(AuthService, contextId);

        const user = await authService.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException("Local validate error");
        }
        return user;
    }
}
