import { BadRequestException } from "@nestjs/common";

export class UnauthoriziedUserException extends BadRequestException {
    constructor(error?: string) {
        super("Unauthorized user", error);
    }
}
