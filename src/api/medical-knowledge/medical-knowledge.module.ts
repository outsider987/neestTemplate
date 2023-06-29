import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalKnowledgeCategory } from 'src/entities/medical-knowledge-category.entity';
import { MedicalKnowledgeSubCategory } from 'src/entities/medical-knowledge-sub-category.entity';
import { MedicalKnowledge } from 'src/entities/medical-knowledge.entity';
import { MedicalKnowledgeController } from './medical-knowledge.controller';
import { MedicalKnowledgeService } from './medical-knowledge.service';

@Module({
    controllers: [MedicalKnowledgeController],
    providers: [MedicalKnowledgeService],
    imports: [
        TypeOrmModule.forFeature([MedicalKnowledge, MedicalKnowledgeCategory, MedicalKnowledgeSubCategory]),
        ConfigModule,
    ],
    exports: [MedicalKnowledgeService],
})
export class MedicalKnowledgeModule {}
