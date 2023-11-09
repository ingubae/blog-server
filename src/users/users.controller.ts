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
import { UpdateResult } from "typeorm";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/users.entity";
import { AuthService } from "src/auth/auth.service";

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

    @Get()
    readAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get(":id")
    read(@Param("id", ParseIntPipe) id: number): Promise<User> {
        return this.usersService.findOneBy({ id });
    }

    @Patch(":id")
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<UpdateResult> {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(":id")
    delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
        return this.usersService.delete(id);
    }
}
