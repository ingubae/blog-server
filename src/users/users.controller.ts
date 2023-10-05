import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    // Req,
    // Res,
    // Session,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/users.entity";
import { UpdateResult } from "typeorm";

// import { UseGuards } from "@nestjs/common";
// import { AuthGuard } from "@nestjs/passport";
// import { Request } from "express";
import { AuthService } from "src/auth/auth.service";
import { Public } from "src/auth/constants";
// import { LoginUserDto } from "src/auth/dto/login-user.dto";

@Controller("users")
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService
    ) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.create(createUserDto);
    }

    @Public()
    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Public()
    @Get(":id")
    findOne(@Param("id", ParseIntPipe) id: number): Promise<User> {
        return this.usersService.findOneById(id);
    }

    @Patch(":id")
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<UpdateResult> {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(":id")
    remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
        return this.usersService.remove(id);
    }
}
