import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtTFAGuard extends AuthGuard("jwt-tfa-token") {}
