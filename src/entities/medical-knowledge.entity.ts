import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { InformationType } from './information-type.entity';
import { MedicalKnowledgeCategory } from './medical-knowledge-category.entity';
import { MedicalKnowledgeSubCategory } from './medical-knowledge-sub-category.entity';

@Entity('medical-knowledge')
export class MedicalKnowledge {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => MedicalKnowledgeCategory)
    @JoinColumn({ name: 'category' })
    category: MedicalKnowledgeCategory;

    @ManyToOne(() => MedicalKnowledgeSubCategory)
    @JoinColumn({ name: 'sub_category' })
    subCategory: MedicalKnowledgeSubCategory;

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
