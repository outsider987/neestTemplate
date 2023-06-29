import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/api/auth/guard';
import { MedicalKnowledgeService } from './medical-knowledge.service';

@Controller('medical-knowledge')
export class MedicalKnowledgeController {
    constructor(private medicalKnowledgeService: MedicalKnowledgeService) {}

    @Get('categorys')
    @UseGuards(JwtGuard)
    getCategorys() {
        return this.medicalKnowledgeService.getCategorys();
    }

    @Get('sub-categorys')
    @UseGuards(JwtGuard)
    getSubCategorys(@Query('category') category: number) {
        return this.medicalKnowledgeService.getSubCategorys({
            where: {
                category: {
                    id: category,
                },
            },
        });
    }

    @Get('articles')
    @UseGuards(JwtGuard)
    getArticles(@Query('subCategory') subCategory: number) {
        return this.medicalKnowledgeService.listArticles({
            where: {
                subCategory: {
                    id: subCategory,
                },
            },
        });
    }

    @Get('article')
    @UseGuards(JwtGuard)
    getArticle(@Query('id') id: number) {
        return this.medicalKnowledgeService.getArticle({
            where: {
                id: id,
            },
        });
    }
}
