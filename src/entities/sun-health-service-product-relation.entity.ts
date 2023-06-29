import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SunHealthServiceProduct } from "./sun-health-service-product.entity";
import { SunHealthServiceType } from "./sun-health-service-type.entity";

@Entity('sun-health-service-product-relation')
export class SunHealthServiceProductRelation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => SunHealthServiceType)
    @JoinColumn({ name: 'service_type' })
    serviceType: SunHealthServiceType;

    @ManyToOne(() => SunHealthServiceProduct)
    @JoinColumn({ name: 'product_type' })
    productType: SunHealthServiceProduct;
}
