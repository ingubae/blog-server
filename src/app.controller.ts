import { Controller /*, Get, Request, Post, UseGuards*/ } from "@nestjs/common";
// import { AppService } from "./app.service";
// import { AuthGuard } from "@nestjs/passport";
// import { AuthService } from "./auth/auth.service";
// import { LocalAuthGuard } from "./auth/local/local-auth.guard";
// import { JwtAuthGuard } from "./auth/jwt/jwt.guard";

@Controller()
export class AppController {
    // constructor(private authService: AuthService) {}
    // // @UseGuards(AuthGuard("local"))
    // @UseGuards(LocalAuthGuard)
    // @Post("auth/login")
    // async login(@Request() req) {
    //     return this.authService.login(req.user);
    // }
    // @UseGuards(JwtAuthGuard)
    // @Get("profile")
    // getProfile(@Request() req) {
    //     return req.user;
    // }
}
