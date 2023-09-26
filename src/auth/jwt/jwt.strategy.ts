import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { COOKIE_AUTH_KEY, jwtConstants } from "../constants";
import { UsersService } from "src/users/users.service";
import { UserNotFoundException } from "src/users/exceptions/exception-user-not-found";
// import { ConfigService } from "@nestjs/config";
// import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // jwtFromRequest: fromAuthCookie(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    async validate(payload: any) {
        // return { id: payload.sub, email: payload.email };

        const user = await this.usersService.findOneByEmail(payload.email);
        if (!user) {
            throw new UserNotFoundException("Not register user!");
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fromAuthCookie = function () {
    return function (request) {
        let token = null;
        if (request && request.cookies) {
            token = request.cookies[COOKIE_AUTH_KEY];
        }
        return token;
    };
};
