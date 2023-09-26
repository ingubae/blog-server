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

    async signIn(email: string, pass: string): Promise<any> {
        const user = await this.validateUser(email, pass);
        return this.login(user);
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new UserNotFoundException("Not register user!");
        }
        const isValid: boolean = await bcrypt.compare(pass, user.password);
        if (!isValid) {
            throw new UnauthorizedException("Unauthorizied user & password");
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
