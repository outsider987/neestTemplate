import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('advisor-health-points')
export class AdvisorHealthPoints {
    @PrimaryColumn({ name: 'agent_code' })
    agentCode: string;

    @Column({ name: 'total_earned' })
    totalEarned: number;

    @Column({ name: 'total_used' })
    totalUsed: number;

    @Column({ name: 'remaining' })
    remaining: number;
}