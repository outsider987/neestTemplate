import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('sun-health-service-type')
export class SunHealthServiceType {
    @PrimaryColumn()
    id: number;

    @Column({ name: 'en' })
    en: string;

    @Column({ name: 'zh_hk' })
    zhHk: string;

    @Column({ name: 'zh_cn' })
    zhCn: string;
}