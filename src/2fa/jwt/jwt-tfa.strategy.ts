import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { COOKIE_TFA_KEY, jwtConstants } from "../../auth/constants";
import { UsersService } from "src/users/users.service";

export interface Payload {
    sub: number;
    email: string;
    isSecondFA: boolean;
    // firstName: string;
    // lastName: string;
}

@Injectable()
export class JwtTFAStrategy extends PassportStrategy(Strategy, "jwt-tfa-token") {
    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => {
                    return req?.cookies?.[COOKIE_TFA_KEY];
                },
            ]),
            secretOrKey: jwtConstants.secret,
            ignoreExpiration: false,
        });
    }

    async validate(payload: Payload): Promise<any> {
        console.log("JwtTFAStrategy::validate()");
        console.log(payload);

        const user = await this.usersService.findOneBy({ id: payload.sub });
        if (!user) {
            return new UnauthorizedException({ message: "Not register user!" });
        }

        if (user.isTwoFAEnabled === false || payload.isSecondFA === true) {
            return user;
        }

        return new UnauthorizedException("Two FA Auth failed");
    }
}
