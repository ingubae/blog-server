import {
    // Body,
    Controller,
    Get,
    // HttpCode,
    // HttpStatus,
    Post,
    Request,
    UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "./constants";

import { LocalAuthGuard } from "./local/local.guard";
// import { JwtAuthGuard } from "./jwt/jwt.guard";
// import { AuthGuard } from "./auth.guard";
// import { LoginUserDto } from "./dto/login-user.dto";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    // @Public()
    // @Post("login")
    // async login(@Body() logInDto: LoginUserDto) {
    //     return this.authService.login(logInDto);
    // }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post("login")
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    // @UseGuards(JwtAuthGuard)
    @Get("profile")
    getProfile(@Request() req) {
        return req.user;
    }
}
