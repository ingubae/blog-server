import { Injectable } from "@nestjs/common";
import { /*Repository, */ FindOptionsWhere, UpdateResult } from "typeorm";
// import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";

import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/users.entity";
import { EmailAlreadyExistException } from "./exceptions/exception-email-already-exist";
import { jwtConstants } from "src/auth/constants";
import { UserRepository } from "./repository/user.repository";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class UsersService {
    constructor(
        // @InjectRepository(User) private usersRepository: Repository<User>
        private usersRepository: UserRepository
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const tempUser = await this.usersRepository.findOneBy({ email: createUserDto.email });
        if (tempUser) {
            const error = "Input data validation falied";
            throw new EmailAlreadyExistException(error);
        }

        const user = new User();
        user.name = createUserDto.name;
        user.email = createUserDto.email;
        user.password = createUserDto.password;

        return this.usersRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findOneBy(where: FindOptionsWhere<User>): Promise<User | null> {
        return await this.usersRepository.findOneBy(where);
    }

    async update(id: number, data: Partial<User>): Promise<UpdateResult> {
        return this.usersRepository.update(id, data);
    }

    async delete(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }

    async setRefreshToken(id: number, token: string) {
        const now = new Date();
        const refreshToken = await bcrypt.hash(token, 10);
        const refreshTokenExp = new Date(now.getTime() + jwtConstants.refresh_expiry);

        await this.usersRepository.update(id, {
            refreshToken,
            refreshTokenExp,
        });
    }

    async removeRefreshToken(id: number) {
        return await this.usersRepository.update(id, {
            refreshToken: null,
            refreshTokenExp: null,
        });
    }

    async getUserIfTokenMatch(id: number, token: string): Promise<User> {
        const user: User = await this.findOneBy({ id });
        if (user?.refreshToken === null) {
            console.log("user.refreshToken is null");
            return null;
        }

        const now = Date.now();
        if (user?.refreshTokenExp?.getTime() < now) {
            console.log("user.refreshTokenExp is expired");
            this.removeRefreshToken(id);
            return null;
        }

        const isMatch = await bcrypt.compare(token, user.refreshToken);
        if (!isMatch) {
            console.log("refreshToken does not matched");
            return null;
        }

        return user;
    }

    async findUsersWithExpiredTokens(currentTime: number): Promise<User[]> {
        const queryBuilder = this.usersRepository.createQueryBuilder("user");
        const users = await queryBuilder
            .where("user.refreshTokenExp <= :currentTime", {
                currentTime: new Date(currentTime),
            })
            .getMany();

        return users;
    }

    @Cron(CronExpression.EVERY_10_MINUTES)
    async removeExpiredTokens() {
        const currentTime = new Date().getTime();
        const users = await this.findUsersWithExpiredTokens(currentTime);
        console.log("removeExpiredTokens(): expired users: ");
        console.log(users);
        for (const user of users) {
            if (user.refreshToken) {
                await this.removeRefreshToken(user.id);
            }
        }
    }

    async setTwoFASecret(id: number, secret: string): Promise<UpdateResult> {
        return this.usersRepository.update(id, {
            twoFASecret: secret,
        });
    }

    async turnOnTwoFA(id: number): Promise<UpdateResult> {
        return await this.usersRepository.update(id, {
            isTwoFAEnabled: true,
        });
    }

    async turnOffTwoFA(id: number): Promise<UpdateResult> {
        return await this.usersRepository.update(id, {
            twoFASecret: null,
            isTwoFAEnabled: false,
        });
    }
}
