import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Repository } from 'typeorm';
import { SunHealthService } from 'src/entities/sun-health-service.entity';
import { SunHealthServiceType } from 'src/entities/sun-health-service-type.entity';
import { SunHealthServiceProduct } from 'src/entities/sun-health-service-product.entity';
import { SunHealthServiceProductRelation } from 'src/entities/sun-health-service-product-relation.entity';
import { SunHealthServiceProductCategory } from 'src/entities/sun-health-service-product-category.entity';
import { SunHealthServiceCategoryProductRelation } from 'src/entities/sun-health-service-category-product-relation.entity';
import { HmgErrorException } from 'src/exceptions/hmg-exception';

@Injectable()
export class SunHealthServiceService {
    constructor(
        private config: ConfigService,
        @InjectRepository(SunHealthService) private repo: Repository<SunHealthService>,
        @InjectRepository(SunHealthServiceType) private typeRepo: Repository<SunHealthServiceType>,
        @InjectRepository(SunHealthServiceProduct) private productRepo: Repository<SunHealthServiceProduct>,
        @InjectRepository(SunHealthServiceProductRelation)
        private serviceProductRepo: Repository<SunHealthServiceProductRelation>,
        @InjectRepository(SunHealthServiceProductCategory)
        private categoryRepo: Repository<SunHealthServiceProductCategory>,
        @InjectRepository(SunHealthServiceCategoryProductRelation)
        private categoryProductRepo: Repository<SunHealthServiceCategoryProductRelation>,
    ) {}

    async getServiceType(productType: number) {
        try {
            let types;
            if (productType) {
                // Filter by product type
                const serviceProducts = await this.serviceProductRepo.find({
                    where: {
                        productType: {
                            id: productType,
                        },
                    },
                    relations: {
                        serviceType: true,
                    },
                });
                const list = [];
                serviceProducts.map((value) => {
                    list.push(value.serviceType.id);
                });
                types = await this.typeRepo.find({
                    where: {
                        id: In(list),
                    },
                });
            } else {
                types = await this.typeRepo.find();
            }
            return {
                status: 200,
                data: { types },
            };
        } catch (error) {
            throw new HmgErrorException('GET_SERVICE_TYPE_ERROR');
        }
    }

    async getProductCategory() {
        try {
            const result = await this.categoryRepo.find();
            return {
                status: 200,
                data: { result },
            };
        } catch (error) {
            throw new HmgErrorException('GET_PRODUCT_CATEGORIES_ERROR');
        }
    }

    async getProductType(category: number) {
        try {
            const productCategory = await this.categoryProductRepo.find({
                where: {
                    categoryType: {
                        id: category,
                    },
                },
                relations: {
                    productType: true,
                },
            });
            const list = [];
            productCategory.map((value) => {
                list.push(value.productType.id);
            });
            const products = await this.productRepo.find({
                where: {
                    id: In(list),
                },
            });
            return {
                status: 200,
                data: { products },
            };
        } catch (error) {
            throw new HmgErrorException('GET_PRODUCT_TYPE_ERROR');
        }
    }

    async listArticles(query: FindManyOptions<SunHealthService>) {
        try {
            const list = await this.repo.find({
                ...query,
                select: {
                    id: true,
                    titleZhCN: true,
                    titleZhHK: true,
                    titleEn: true,
                },
                relations: {
                    informationType: true,
                },
            });
            return {
                status: 200,
                data: { list },
            };
        } catch (error) {
            throw new HmgErrorException('GET_ARTICLE_LIST_ERROR');
        }
    }

    async getArticle(id: FindManyOptions<SunHealthService>) {
        try {
            const article = await this.repo.find(id);
            return {
                status: 200,
                data: { article },
            };
        } catch (error) {
            throw new HmgErrorException('GET_ARTICLE_ERROR');
        }
    }
}
