import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from "bcrypt";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 32 })
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @BeforeInsert()
    async hashPassword() {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    @Column({ default: "" })
    imageLink: string;

    @Column({ nullable: true })
    refreshToken: string;

    @Column({ type: "timestamp", nullable: true })
    refreshTokenExp: Date;

    @Column({ nullable: true })
    twoFASecret: string;

    @Column({ default: false })
    isTwoFAEnabled: boolean;
}
