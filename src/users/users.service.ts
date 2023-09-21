import { Injectable } from "@nestjs/common";
import { Repository, UpdateResult } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/users.entity";
import { EmailAlreadyExistException } from "./exceptions/exception-email-already-exist";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

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

    async findOneById(id: string): Promise<any> {
        const user = await this.usersRepository.findOneBy({ id: +id });
        if (user) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async findOneByNmme(name: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ name: name });
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ email: email });
    }

    async update(id: string, data: Partial<User>): Promise<UpdateResult> {
        // const user = this.usersRepository.findOneBy({ id });
        return this.usersRepository.update(id, data);
    }

    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }
}
