import { Injectable } from "@nestjs/common";
import { Response } from "express";
import { authenticator } from "otplib";
import { toFileStream } from "qrcode";
import { User } from "src/users/entities/users.entity";
import { UsersService } from "src/users/users.service";

@Injectable()
export class TwoFactorAuthService {
    constructor(private readonly usersService: UsersService) {}

    async generateTwoFASecret(user: User): Promise<any> {
        const secret = authenticator.generateSecret();
        const otpAuthUrl = authenticator.keyuri(user.email, "otpauth://", secret);
        await this.usersService.setTwoFASecret(user.id, secret);

        return {
            secret,
            otpAuthUrl,
        };
    }

    async pipeQrCodeStream(stream: Response, otpAuthUrl: string): Promise<void> {
        return toFileStream(stream, otpAuthUrl);
    }

    async isTwoFACodeValid(twoFACode: string, user: User) {
        console.log(twoFACode);

        const tempUser = await this.usersService.findOneBy({ id: user.id });
        if (!tempUser.twoFASecret) {
            return false;
        }
        console.log(tempUser.twoFASecret);

        return authenticator.verify({
            token: twoFACode,
            secret: tempUser.twoFASecret,
        });
    }
}
