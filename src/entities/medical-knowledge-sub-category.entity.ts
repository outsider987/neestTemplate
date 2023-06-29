import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { MedicalKnowledgeCategory } from './medical-knowledge-category.entity';

@Entity('medical-knowledge-sub-category')
export class MedicalKnowledgeSubCategory {
    @PrimaryColumn()
    id: number;

    @ManyToOne(() => MedicalKnowledgeCategory)
    @JoinColumn({ name: 'category' })
    category: MedicalKnowledgeCategory;

    @Column({ name: 'en' })
    en: string;

    @Column({ name: 'zh_hk' })
    zhHk: string;

    @Column({ name: 'zh_cn' })
    zhCn: string;
}
