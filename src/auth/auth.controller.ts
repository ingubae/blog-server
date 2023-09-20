import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";
import { LoginUserDto } from "./dto/login-user.dto";
import { Public } from "./constants";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post("login")
    signIn(@Body() logInDto: LoginUserDto) {
        return this.authService.signIn(logInDto.email, logInDto.password);
    }

    @UseGuards(AuthGuard)
    @Get("profile")
    getProfile(@Request() req) {
        return req.user;
    }
}
