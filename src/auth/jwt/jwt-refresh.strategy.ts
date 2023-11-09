import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UsersService } from "src/users/users.service";
import { COOKIE_REFRESH_KEY, jwtConstants } from "../constants";
import { Payload } from "./jwt.strategy";
import { Request } from "express";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh-token") {
    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => {
                    return req?.cookies?.[COOKIE_REFRESH_KEY];
                },
            ]),
            secretOrKey: jwtConstants.refresh_secret,
            ignoreExpiration: false,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: Payload): Promise<any> {
        console.log("JwtRefreshStrategy::validate()");

        const refreshToken = req.cookies[COOKIE_REFRESH_KEY];
        const user = await this.usersService.getUserIfTokenMatch(payload.sub, refreshToken);
        if (!user) {
            return new UnauthorizedException({ message: "Not register user!" });
        }
        return user;
    }
}
