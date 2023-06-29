import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { SunHealthServiceType } from './sun-health-service-type.entity';

@Entity('advisor-booking-history')
export class AdvisorBookingHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'agent_code' })
    agentCode: string;

    @ManyToOne(() => SunHealthServiceType)
    @JoinColumn({ name: 'service_type' })
    serviceType: SunHealthServiceType;

    @Column()
    total: number;
}
