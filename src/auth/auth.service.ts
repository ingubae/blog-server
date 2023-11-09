import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

import { UsersService } from "src/users/users.service";
import { UnauthorizedException } from "@nestjs/common";
import { User } from "src/users/entities/users.entity";
import { jwtConstants } from "./constants";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { Payload } from "./jwt/jwt.strategy";
// import { LoginUserDto } from "src/auth/dto/login-user.dto";
// import { RefreshTokenDto } from "./dto/refresh-token.dto";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneBy({ email });
        if (!user) {
            throw new UnauthorizedException({ message: "Not register user" });
        }
        const isValid: boolean = await bcrypt.compare(pass, user.password);
        if (!isValid) {
            throw new UnauthorizedException({ message: "Unauthorizied user" });
        }

        return user;
    }

    async registerUser(newUser: CreateUserDto): Promise<any> {
        return this.usersService.create(newUser);
    }

    async login(user: User) {
        const access_token = await this.generateAccessToken(user);
        const refresh_token = await this.generateRefreshToken(user);
        return {
            access_token,
            refresh_token,
        };
    }

    async generateAccessToken(user: User): Promise<string> {
        const payload = { sub: user.id, email: user.email };
        return this.jwtService.signAsync(payload);
    }

    async generateRefreshToken(user: User): Promise<string> {
        const payload = { sub: user.id };
        return this.jwtService.signAsync(payload, {
            secret: jwtConstants.refresh_secret,
            expiresIn: `${jwtConstants.refresh_expiry}`,
        });
    }

    async refresh(refresh_token: string): Promise<{ accessToken: string }> {
        try {
            const decodedToken: Payload = this.jwtService.verify(refresh_token, {
                secret: jwtConstants.refresh_secret,
            });
            console.log("refresh():: decoded payload: ");
            console.log(decodedToken);
            const id = decodedToken.sub;
            const user = await this.usersService.getUserIfTokenMatch(id, refresh_token);
            if (!user) {
                throw new UnauthorizedException("Invalid user!");
            }

            const accessToken = await this.generateAccessToken(user);
            return { accessToken };
        } catch (err) {
            console.log(err);
            throw new UnauthorizedException("Token expired!");
        }
    }
}
