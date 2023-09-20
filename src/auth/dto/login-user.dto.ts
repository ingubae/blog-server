// import { IsNotEmpty } from "class-validator";
import { PickType } from "@nestjs/mapped-types";
import { User } from "src/users/entities/users.entity";

// export class LoginUserDto {
//     @IsNotEmpty()
//     readonly name: string;

//     @IsNotEmpty()
//     readonly password: string;
// }

export class LoginUserDto extends PickType(User, ["email", "password"] as const) {}
