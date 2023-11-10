import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    ForbiddenException,
    Get,
    Post,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { TwoFactorAuthService } from "./2fa.service";
import { JwtAuthGuard } from "src/auth/jwt/jwt.guard";
import { Response } from "express";
import { TwoFACodeDto } from "./dto/twoFA.dto";
import { UsersService } from "src/users/users.service";
import { AuthService } from "src/auth/auth.service";
import { COOKIE_TFA_KEY } from "src/auth/constants";
import { JwtTFAGuard } from "./jwt/jwt-tfa.guard";

@Controller("2fa")
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthController {
    constructor(
        private readonly twoFAService: TwoFactorAuthService,
        private readonly usersService: UsersService,
        private readonly authService: AuthService
    ) {}

    @Post("generate")
    @UseGuards(JwtAuthGuard)
    async register(@Res() res: Response, @Req() req: any) {
        const { otpAuthUrl } = await this.twoFAService.generateTwoFASecret(req.user);
        return await this.twoFAService.pipeQrCodeStream(res, otpAuthUrl);
    }

    @Post("authenticate")
    @UseGuards(JwtAuthGuard)
    async authenticate(@Req() req: any, @Body() twoFACodeDto: TwoFACodeDto) {
        const user = await this.usersService.findOneBy({ id: req.user.id });
        if (!user.isTwoFAEnabled) {
            throw new ForbiddenException("Two-Factor Authentication is not enabled");
        }

        const isValid = await this.twoFAService.isTwoFACodeValid(twoFACodeDto.twoFACode, req.user);
        if (!isValid) {
            throw new UnauthorizedException("Invalid Authentication-Code");
        }

        const tfa_token = await this.authService.generateTwoFAToken(req.user, true);
        req.res.cookie(COOKIE_TFA_KEY, tfa_token, { httpOnly: true });

        return user;
    }

    @Post("turn-on")
    @UseGuards(JwtAuthGuard)
    async turnOnTwoFA(@Req() req: any, @Body() twoFACodeDto: TwoFACodeDto) {
        const isValid = await this.twoFAService.isTwoFACodeValid(twoFACodeDto.twoFACode, req.user);
        if (!isValid) {
            throw new UnauthorizedException("Invalid Authentication-Code");
        }

        await this.usersService.turnOnTwoFA(req.user.id);

        return {
            message: "TwoFactorAuthentication turned on",
        };
    }

    @Post("turn-off")
    @UseGuards(JwtAuthGuard)
    async turnOffTwoFA(@Req() req: any, @Body() twoFACodeDto: TwoFACodeDto) {
        const isValid = await this.twoFAService.isTwoFACodeValid(twoFACodeDto.twoFACode, req.user);
        if (!isValid) {
            throw new UnauthorizedException("Invalid Authentication-Code");
        }

        await this.usersService.turnOffTwoFA(req.user.id);

        return {
            message: "TwoFactorAuthentication turned off",
        };
    }

    @Get("access-tfa")
    @UseGuards(JwtTFAGuard)
    async accessWithTFA(@Req() req: any) {
        const user = await this.usersService.findOneBy({ id: req.user.id });
        if (!user) {
            throw new UnauthorizedException("Two-Factor Authentication is not permited");
        }
        return user;
    }
}
