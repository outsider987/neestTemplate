import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingFiles } from 'src/entities/bookingFiles';
import { Agents } from 'src/entities/agents.entity';

@Module({
    controllers: [UploadController],
    providers: [UploadService],
    imports: [TypeOrmModule.forFeature([BookingFiles, Agents]), ConfigModule],
    exports: [UploadService],
})
export class UploadModule {}
