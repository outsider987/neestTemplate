import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('booking_files')
export class BookingFiles {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'bucket' })
    bucket: string;

    @Column({ name: 'key' })
    key: string;

    @Column({ name: 'reference_no' })
    referenceNo: string;

    @Column({ name: 'policy_number' })
    policyNumber: string;

    @Column({ name: 'file_name' })
    fileName: string;

    @Column({ name: 'content_type' })
    contentType: string;

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
