import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SunHealthServiceController } from './sun-health-service.controller';
import { SunHealthServiceService } from './sun-health-service.service';
import { SunHealthService } from 'src/entities/sun-health-service.entity';
import { SunHealthServiceType } from 'src/entities/sun-health-service-type.entity';
import { SunHealthServiceProduct } from 'src/entities/sun-health-service-product.entity';
import { SunHealthServiceProductRelation } from 'src/entities/sun-health-service-product-relation.entity';
import { SunHealthServiceProductCategory } from 'src/entities/sun-health-service-product-category.entity';
import { SunHealthServiceCategoryProductRelation } from 'src/entities/sun-health-service-category-product-relation.entity';

@Module({
    controllers: [SunHealthServiceController],
    providers: [SunHealthServiceService],
    imports: [
        TypeOrmModule.forFeature([
            SunHealthService,
            SunHealthServiceType,
            SunHealthServiceProduct,
            SunHealthServiceProductRelation,
            SunHealthServiceProductCategory,
            SunHealthServiceCategoryProductRelation,
        ]),
        ConfigModule,
    ],
    exports: [SunHealthServiceService],
})
export class SunHealthServiceModule {}
