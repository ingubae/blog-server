import { Repository } from "typeorm";
import { CustomRepository } from "./typeorm-ex.decorator";
import { User } from "../entities/users.entity";

@CustomRepository(User)
export class UserRepository extends Repository<User> {}
