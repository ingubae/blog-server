import {
    Body,
    Controller,
    Get,
    Logger,
    // Param,
    // ParseIntPipe,
    // HttpCode,
    // HttpStatus,
    Post,
    Req,
    Res,
    UnauthorizedException,
    // Session,
    UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { COOKIE_ACCESS_KEY, COOKIE_REFRESH_KEY } from "./constants";

import { LocalAuthGuard } from "./local/local.guard";
import { UsersService } from "src/users/users.service";
import { User } from "src/users/entities/users.entity";
import { JwtAuthGuard } from "./jwt/jwt.guard";
// import { AuthGuard } from "./auth.guard";
// import { LoginUserDto } from "./dto/login-user.dto";
// import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { JwtRefreshGuard } from "./jwt/jwt-refresh.guard";

@Controller("auth")
export class AuthController {
    private logger = new Logger("AuthController");

    constructor(
        private authService: AuthService,
        private usersService: UsersService
    ) {}

    @Post("/register")
    async registerAccount(@Req() req: Request, @Body() userDto: CreateUserDto): Promise<any> {
        return await this.authService.registerUser(userDto);
    }

    @UseGuards(LocalAuthGuard)
    @Post("login")
    async login(
        // @Body() logInDto: LoginUserDto,
        @Req() req: any,
        @Res({ passthrough: true }) res: Response
    ): Promise<any> {
        // Using "LocalAuthGuard" insted of direct call of validateUser()
        // const user = await this.authService.validateUser(logInDto.email, logInDto.password);

        const user = req.user;
        const { access_token, refresh_token } = await this.authService.login(user);
        await this.usersService.setRefreshToken(user.id, refresh_token);

        // res.setHeader("Authorization", "Bearer " + [access_token]);
        res.cookie(COOKIE_ACCESS_KEY, access_token, { httpOnly: true });
        res.cookie(COOKIE_REFRESH_KEY, refresh_token, { httpOnly: true });

        return {
            id: user.id,
            message: "login success",
            access_token: access_token,
            refresh_token: refresh_token,
        };
    }

    @UseGuards(JwtRefreshGuard)
    @Post("logout")
    async logout(@Req() req: any, @Res() res: Response): Promise<any> {
        // const id: number = req.user.id;
        await this.usersService.removeRefreshToken(req.user.id);
        res.clearCookie(COOKIE_ACCESS_KEY);
        res.clearCookie(COOKIE_REFRESH_KEY);
        return res.send({
            message: "logout success",
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get("authenticate")
    async user(@Req() req: any, @Res() res: Response): Promise<any> {
        const user: User = await this.usersService.findOneBy({ id: req.user.id });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, refreshToken, ...restUser } = user;
        return res.send(restUser);
    }

    // @UseGuards(JwtRefreshGuard)
    @Get("refresh")
    async refresh(
        @Req() req: any,
        // @Body() refreshToken: RefreshTokenDto,
        @Res({ passthrough: true }) res: Response
    ) {
        try {
            const refreshToken = req.cookies[COOKIE_REFRESH_KEY];
            const { accessToken } = await this.authService.refresh(refreshToken);
            // res.setHeader("Authorization", "Bearer" + accessToken);
            res.cookie(COOKIE_ACCESS_KEY, accessToken, { httpOnly: true });
            res.send({ accessToken });
        } catch (err) {
            throw new UnauthorizedException("Invalid refresh-token");
        }
    }
}
