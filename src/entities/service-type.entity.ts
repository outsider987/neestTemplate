import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('service-type')
export class ServiceType {
    @PrimaryColumn()
    prefix: string;

    @Column({ name: 'en' })
    en: string;

    @Column({ name: 'zh_hk' })
    zhHk: string;

    @Column({ name: 'zh_cn' })
    zhCn: string;

    @Column({ name: 'is_universal_service' })
    isUniversalService: boolean;
}
