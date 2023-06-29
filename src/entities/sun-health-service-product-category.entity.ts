import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('sun-health-service-product-category')
export class SunHealthServiceProductCategory {
    @PrimaryColumn()
    id: number;

    @Column({ name: 'en' })
    en: string;

    @Column({ name: 'zh_hk' })
    zhHk: string;

    @Column({ name: 'zh_cn' })
    zhCn: string;
}