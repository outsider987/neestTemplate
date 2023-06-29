import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('information-type')
export class InformationType {
    @PrimaryColumn()
    id: number;

    @Column()
    type: string;
}
