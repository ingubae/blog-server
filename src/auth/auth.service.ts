import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

import { UsersService } from "src/users/users.service";
// import { LoginUserDto } from "src/auth/dto/login-user.dto";
import { UserNotFoundException } from "src/users/exceptions/exception-user-not-found";
import { UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    // async signIn(email: string, pass: string): Promise<any> {
    //     const user = await this.usersService.findOneByEmail(email);
    //     if (!user) {
    //         const error = "Not register user!";
    //         throw new UserNotFoundException(error);
    //     }
    //     // const { password, ...result } = user;
    //     // return result;

    //     const isValid: boolean = await bcrypt.compare(pass, user.password);
    //     if (!isValid) {
    //         const error = "Unauthorizied user & password";
    //         throw new UnauthorizedException(error);
    //     }

    //     const payload = { sub: user.id, email: user.email };
    //     return {
    //         // access_token: await this.jwtService.signAsync(payload),
    //     };
    // }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            const error = "Not register user!";
            throw new UserNotFoundException(error);
        }

        const isValid: boolean = await bcrypt.compare(pass, user.password);
        if (!isValid) {
            const error = "Unauthorizied user & password";
            throw new UnauthorizedException(error);
        }

        const { password, ...result } = user;
        return result;
    }

    async login(user: any) {
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
