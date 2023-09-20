import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

import { UsersService } from "src/users/users.service";
import { LoginUserDto } from "src/auth/dto/login-user.dto";
import { UserNotFoundException } from "src/users/exceptions/exception-user-not-found";
import { UnauthorizedException } from "@nestjs/common";
import { UnauthoriziedUserException } from "src/users/exceptions/exception-unauthorized-user";

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) {}

    async jwtLogin(data: LoginUserDto) {
        const { email, password } = data;
        const user = await this.userService.findOneByEmail(email);
        if (!user) {
            const error = "Not register user!";
            throw new UserNotFoundException(error);
        }

        const isValid: boolean = await bcrypt.compare(password, user.password);
        if (!isValid) {
            const error = "Unauthorizied user & password";
            throw new UnauthorizedException(error);
        }

        const payload = { email: user.email, sub: user.id };
        return {
            token: this.jwtService.sign(payload),
        };
    }

    async signIn(email: string, pass: string): Promise<any> {
        const user = await this.userService.findOneByEmail(email);
        // if (user?.password !== pass) {
        //     throw new UnauthorizedException();
        // }
        // const { password, ...result } = user;
        // return result;

        if (!user) {
            const error = "Not register user!";
            throw new UserNotFoundException(error);
        }

        const isValid: boolean = await bcrypt.compare(pass, user.password);
        if (!isValid) {
            const error = "Unauthorizied user & password";
            // throw new UnauthorizedException(error);
            throw new UnauthoriziedUserException(error);
        }

        const payload = { sub: user.id, email: user.email };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
