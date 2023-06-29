import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SunHealthServiceProductCategory } from './sun-health-service-product-category.entity';
import { SunHealthServiceProduct } from './sun-health-service-product.entity';

@Entity('sun-health-service-category-product-relation')
export class SunHealthServiceCategoryProductRelation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => SunHealthServiceProductCategory)
    @JoinColumn({ name: 'category_type' })
    categoryType: SunHealthServiceProductCategory;

    @ManyToOne(() => SunHealthServiceProduct)
    @JoinColumn({ name: 'product_type' })
    productType: SunHealthServiceProduct;
}
