import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
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

    // @UseGuards(AuthGuard("jwt"))
    // @Get()
    // async getProfile(@Req() req: Request) {
    //     return req.user;
    // }

    // @UseGuards(AuthGuard("local"))
    // @Post()
    // async login(@Session() session, @Req() req: Request, @Res({ passthrough: true }) res) {
    //     const access_token = (await this.authService.login(req.user)).access_token;
    //     await res.cookie("Authorization", access_token);
    //     return req.user;
    // }
    // @Post("login")
    // login(@Body() data: LoginUserDto) {
    //     return this.authService.jwtLogin(data);
    // }

    @Public()
    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.create(createUserDto);
    }

    @Public()
    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string): Promise<User> {
        return this.usersService.findOneById(id);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto): Promise<UpdateResult> {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string): Promise<void> {
        return this.usersService.remove(id);
    }
}
