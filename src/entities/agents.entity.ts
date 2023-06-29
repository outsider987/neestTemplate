import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('agents')
export class Agents {
    @PrimaryColumn()
    agentCode: string;

    @Column()
    token: string;

    @Column({ name: 'is_super' })
    isSuper: boolean;
}
