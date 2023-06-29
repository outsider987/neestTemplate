import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { InformationType } from './information-type.entity';
import { SunHealthServiceProduct } from './sun-health-service-product.entity';
import { SunHealthServiceType } from './sun-health-service-type.entity';

@Entity('sun-health-service')
export class SunHealthService {
    @PrimaryGeneratedColumn()
    id: number;

    /* @ManyToOne(() => SunHealthServiceProduct)
    @JoinColumn({ name: 'product_type' })
    productType: SunHealthServiceProduct; */

    @ManyToOne(() => SunHealthServiceType)
    @JoinColumn({ name: 'service_type' })
    serviceType: SunHealthServiceType;

    @ManyToOne(() => InformationType)
    @JoinColumn({ name: 'type' })
    informationType: InformationType;

    @Column({ type: 'longtext', name: 'content_zh_hk' })
    contentZhHK: string;

    @Column({ length: 100, name: 'title_zh_hk' })
    titleZhHK: string;

    @Column({ type: 'longtext', name: 'content_zh_cn' })
    contentZhCN: string;

    @Column({ length: 100, name: 'title_zh_cn' })
    titleZhCN: string;

    @Column({ type: 'longtext', name: 'content_en' })
    contentEn: string;

    @Column({ length: 100, name: 'title_en' })
    titleEn: string;
}
