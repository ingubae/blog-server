import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC_KEY } from "../constants";
import { JwtService } from "@nestjs/jwt";
import { JwtRefreshStrategy } from "./jwt-refresh.strategy";

@Injectable()
export class JwtRefreshGuard extends AuthGuard("jwt-refresh-token") {
    constructor(
        private reflector: Reflector,
        private jwtService: JwtService,
        private jwtStrategy: JwtRefreshStrategy
    ) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<any> {
        console.log("JwtRefreshGuard::canActivate()");

        // eslint-disable-next-line prettier/prettier
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }

        // Add your custom authentication logic here
        // for example, call super.logIn(request) to establish a session.
        return super.canActivate(context);

        // try {
        //     const req = context.switchToHttp().getRequest();
        //     const refresh_token = req.cookies[COOKIE_REFRESH_KEY];
        //     const payload = await this.jwtService.verify(refresh_token, {
        //         secret: jwtConstants.refresh_secret,
        //     });
        //     if (!payload) {
        //         throw new UnauthorizedException({ message: "token verify failed" });
        //     }
        //     // Do we need to this call ??
        //     const user = await this.jwtStrategy.validate(req, payload);
        //     if (!user) {
        //         throw new UnauthorizedException({ message: "user validate failed" });
        //     }
        //     req.user = user;

        //     return true;
        // } catch (err) {
        //     console.log(err);
        //     return false;
        // }
    }
}
