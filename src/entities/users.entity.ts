import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column({ name: 'name_cn' })
    nameCn: string;

    @Column({ name: 'name_en' })
    nameEn: string;

    @Column()
    password: string;

    @CreateDateColumn({
        type: 'datetime',
        name: 'created_at',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'datetime',
        name: 'updated_at',
    })
    updatedAt: Date;
}
