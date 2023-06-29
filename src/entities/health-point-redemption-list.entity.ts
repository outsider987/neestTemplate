import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('health-point-redemption-list')
export class HealthPointRedemptionList {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100, name: 'title_zh_hk' })
    titleZhHK: string;

    @Column({ length: 100, name: 'title_zh_cn' })
    titleZhCN: string;

    @Column({ length: 100, name: 'title_en' })
    titleEn: string;

    @Column()
    points: number;

    @Column({ type: 'longtext' })
    scheme1: string;

    @Column({ type: 'longtext' })
    scheme2: string;
}
