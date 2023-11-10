import { IsNotEmpty } from "class-validator";

export class TwoFACodeDto {
    @IsNotEmpty()
    twoFACode: string;
}
