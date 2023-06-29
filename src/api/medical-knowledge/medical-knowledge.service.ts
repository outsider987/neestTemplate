import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicalKnowledgeCategory } from 'src/entities/medical-knowledge-category.entity';
import { MedicalKnowledgeSubCategory } from 'src/entities/medical-knowledge-sub-category.entity';
import { MedicalKnowledge } from 'src/entities/medical-knowledge.entity';
import { HmgErrorException } from 'src/exceptions/hmg-exception';
import { FindManyOptions, FindOptionsWhere, Repository, TreeRepository } from 'typeorm';

@Injectable()
export class MedicalKnowledgeService {
    constructor(
        private config: ConfigService,
        @InjectRepository(MedicalKnowledge) private repo: Repository<MedicalKnowledge>,
        @InjectRepository(MedicalKnowledgeCategory) private catRepo: Repository<MedicalKnowledgeCategory>,
        @InjectRepository(MedicalKnowledgeSubCategory) private subCatRepo: Repository<MedicalKnowledgeSubCategory>,
    ) {}

    async getCategorys() {
        try {
            const categorys = await this.catRepo.find();
            return {
                status: 200,
                data: { categorys },
            };
        } catch (error) {
            throw new HmgErrorException('GET_CATETORIES_ERROR');
        }
    }

    async getSubCategorys(category: FindManyOptions<MedicalKnowledgeSubCategory>) {
        try {
            const subCategorys = await this.subCatRepo.find(category);
            return {
                status: 200,
                data: { subCategorys },
            };
        } catch (error) {
            throw new HmgErrorException('GET_SUB_CATEGORIES_ERROR');
        }
    }

    async listArticles(subCategory: FindManyOptions<MedicalKnowledge>) {
        try {
            const list = await this.repo.find({
                ...subCategory,
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

    async getArticle(id: FindManyOptions<MedicalKnowledge>) {
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
