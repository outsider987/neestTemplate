import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('super-agent')
export class SuperAgent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column()
    agent_code: string;
}