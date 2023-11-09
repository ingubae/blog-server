import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { COOKIE_ACCESS_KEY, jwtConstants } from "../constants";
import { UsersService } from "src/users/users.service";
// import { UserNotFoundException } from "src/users/exceptions/exception-user-not-found";
// import { ConfigService } from "@nestjs/config";
// import { AuthService } from "../auth.service";

export interface Payload {
    sub: number;
    email: string;
    // firstName: string;
    // lastName: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly usersService: UsersService) {
        super({
            // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => {
                    return req?.cookies?.[COOKIE_ACCESS_KEY];
                },
            ]),
            secretOrKey: jwtConstants.secret,
            ignoreExpiration: false,
        });
    }

    async validate(payload: Payload): Promise<any> {
        console.log("JwtStrategy::validate()");
        // console.log(payload);

        return { id: payload.sub, email: payload.email };

        // const user = await this.usersService.findOneBy({ id: payload.sub });
        // if (!user) {
        //     return new UnauthorizedException({ message: "Not register user!" });
        // }
        // return user;
    }
}
