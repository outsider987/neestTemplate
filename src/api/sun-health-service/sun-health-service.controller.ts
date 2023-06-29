import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/api/auth/guard';
import { ArticlesDto } from './dtos';
import { SunHealthServiceService } from './sun-health-service.service';

@Controller('sun-health-service')
export class SunHealthServiceController {
    constructor(private sunHealthServiceService: SunHealthServiceService) {}

    @Get('productCategorys')
    @UseGuards(JwtGuard)
    getProductCategorys() {
        return this.sunHealthServiceService.getProductCategory();
    }

    @Get('products')
    @UseGuards(JwtGuard)
    getCategorys(@Query('category') productType: number) {
        return this.sunHealthServiceService.getProductType(productType);
    }

    @Get('services')
    @UseGuards(JwtGuard)
    getSubCategorys(@Query('productType') productType: number) {
        return this.sunHealthServiceService.getServiceType(productType);
    }

    @Get('articles')
    @UseGuards(JwtGuard)
    getArticles(@Query() dto: ArticlesDto) {
        return this.sunHealthServiceService.listArticles({
            where: {
                serviceType: {
                    id: dto.serviceType,
                },
            },
        });
    }

    @Get('article')
    @UseGuards(JwtGuard)
    getArticle(@Query('id') id: number) {
        return this.sunHealthServiceService.getArticle({
            where: {
                id: id,
            },
        });
    }
}
