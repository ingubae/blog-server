import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { COOKIE_ACCESS_KEY, IS_PUBLIC_KEY } from "../constants";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { JwtStrategy } from "./jwt.strategy";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
    constructor(
        private reflector: Reflector,
        private jwtService: JwtService,
        private jwtStrategy: JwtStrategy,
        private usersService: UsersService
    ) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<any> {
        console.log("JwtAuthGuard::canActivate()");

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
        //     const access_token = this.extractTokenFromCookie(req);
        //     const payload = await this.jwtService.verify(access_token);
        //     if (!payload) {
        //         return false;
        //     }
        //     // const user = await this.jwtStrategy.validate(payload);
        //     const user = await this.usersService.findOneBy({ id: payload.sub });
        //     if (!user) {
        //         return false;
        //     }

        //     req.user = user;
        //     return true;
        // } catch (err) {
        //     console.log(err);
        //     return false;
        // }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleRequest(err, user, _info) {
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }

    private extractTokenFromHeader(req: Request): string | undefined {
        const [type, token] = req.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }

    private extractTokenFromCookie(req: Request): string | undefined {
        const token = req.cookies[COOKIE_ACCESS_KEY];
        return token;
    }
}
