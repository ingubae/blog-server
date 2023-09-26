import {
    // Body,
    Controller,
    Get,
    Logger,
    // HttpCode,
    // HttpStatus,
    Post,
    Request,
    // Res,
    // Session,
    UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { /*COOKIE_AUTH_KEY,*/ Public } from "./constants";

import { LocalAuthGuard } from "./local/local.guard";
// import { JwtAuthGuard } from "./jwt/jwt.guard";
// import { AuthGuard } from "./auth.guard";
// import { LoginUserDto } from "./dto/login-user.dto";

@Controller("auth")
export class AuthController {
    private logger = new Logger("AuthController");

    constructor(private authService: AuthService) {}

    // @Public()
    // @Post("login")
    // async login(@Body() logInDto: LoginUserDto) {
    //     return this.authService.signIn(logInDto.email, logInDto.password);
    // }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post("login")
    async login(@Request() req) {
        this.logger.debug(`User ${req.user.email} trying to login`);
        return this.authService.login(req.user);
    }

    // // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // async login(@Session() session, @Request() req, @Res({ passthrough: true }) response) {
    //     const { access_token } = await this.authService.login(req.user);
    //     await response.cookie(COOKIE_AUTH_KEY, access_token);

    //     return { access_token: access_token };
    // }

    // @UseGuards(JwtAuthGuard)
    @Get("profile")
    getProfile(@Request() req) {
        // console.log(req.cookies[COOKIE_AUTH_KEY]);

        return req.user;
    }
}
