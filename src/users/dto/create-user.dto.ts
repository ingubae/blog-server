import { PickType } from "@nestjs/mapped-types";
import { User } from "../entities/users.entity";

// import { IsNotEmpty } from "class-validator";

// export class CreateUserDto {
//     @IsNotEmpty()
//     readonly name: string;

//     @IsNotEmpty()
//     readonly email: string;

//     @IsNotEmpty()
//     readonly password: string;
// }

export class CreateUserDto extends PickType(User, ["name", "email", "password"] as const) {}
