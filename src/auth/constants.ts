import { SetMetadata } from "@nestjs/common";

export const jwtConstants = {
    secret: "jwt secret key",
    expiry: 1000 * 60,
    refresh_secret: "jwt refresh secret",
    refresh_expiry: 1000 * 60 * 2,
};

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const COOKIE_ACCESS_KEY = "access_token";
export const COOKIE_REFRESH_KEY = "refresh_token";
