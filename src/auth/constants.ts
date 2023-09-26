import { SetMetadata } from "@nestjs/common";

export const jwtConstants = {
    secret: "jwt secret key",
};

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const COOKIE_AUTH_KEY = "Authorization";
