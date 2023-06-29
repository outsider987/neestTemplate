import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('medical-knowledge-category')
export class MedicalKnowledgeCategory {
    @PrimaryColumn()
    id: number;

    @Column({ name: 'en' })
    en: string;

    @Column({ name: 'zh_hk' })
    zhHk: string;

    @Column({ name: 'zh_cn' })
    zhCn: string;
}