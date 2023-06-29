import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFiles,
    UseGuards,
    Get,
    Body,
    Query,
    UploadedFile,
    Req,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { UploadService } from './upload.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { failureResponse, successResponse } from 'src/utils/response';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { CreateBookingFilesDto } from './dtos/createBookingFiles.dto';
import { v1 as uuidv1 } from 'uuid';
import { fileLimitTypeRegex } from 'src/utils/validateRule';
import errorCodesExternal from 'src/config/errorCodesExternal';
import { ApplicationErrorException } from 'src/exceptions';
import { Request } from 'express';

export const imageOptions: MulterOptions = {
    limits: { fileSize: 1024 * 1024 * 20, files: 10 }, //5242880 byte = 5MB
};
@UseGuards(JwtGuard)
@Controller('upload')
export class UploadController {
    constructor(private uploadService: UploadService) {}

    @Post('booking/temp')
    @UseInterceptors(FilesInterceptor('files', 30, imageOptions))
    async createBookingTempDocument(
        @UploadedFiles()
        files: Express.Multer.File[],
    ) {
        if (files.length < 1) return failureResponse('at leatest one file', 'error.at_leatest_one_file');
        const fileScanResult = await this.uploadService.fileScan(files);
        if (!fileScanResult.data.CleanResult) return failureResponse('virus found from file', 'error');
        const UUID = uuidv1();
        await this.uploadService.createTempFiles(files, UUID);

        return successResponse(UUID);
    }

    @Post('booking')
    @UseInterceptors(FilesInterceptor('files', 30, imageOptions))
    async createBookingDocument(
        @Body() dto: CreateBookingFilesDto,
        @UploadedFiles()
        files: Express.Multer.File[],
        @Req() req: Request,
    ) {
        // type check
        if (files.length < 1) return failureResponse('at leatest one file', 'error.at_leatest_one_file');
        const fileScanResult = await this.uploadService.fileScan(files);
        if (!fileScanResult.data.CleanResult)
            throw new ApplicationErrorException(errorCodesExternal['E-00004'], 'virus found from file', 400);
        files.forEach((file) => {
            if (!fileLimitTypeRegex.test(file.mimetype)) {
                throw new ApplicationErrorException(errorCodesExternal['E-00003']);
            }
        });

        const datas = await this.uploadService.createBookingFiles(files, dto, req);
        return successResponse({ message: `sucess add  ${datas.length} file` });
    }

    @Post('booking/update')
    @UseInterceptors(FilesInterceptor('files', 30, imageOptions))
    async updateBookingDocument(
        @Body() dto: CreateBookingFilesDto,
        @UploadedFiles()
        files: Express.Multer.File[],
        @Req() req: Request,
    ) {
        // type check
        files.forEach((file) => {
            if (!fileLimitTypeRegex.test(file.mimetype)) {
                throw new ApplicationErrorException(errorCodesExternal['E-00003']);
            }
        });

        if (files.length > 0) {
            const fileScanResult = await this.uploadService.fileScan(files);
            if (!fileScanResult.data.CleanResult)
                throw new ApplicationErrorException(errorCodesExternal['E-00004'], 'virus found from file', 400);
        }

        const datas = await this.uploadService.updateBookingFiles(files, dto, req);
        return successResponse({ message: `sucess add  ${datas.length} file` });
    }

    @Post('scan')
    @UseInterceptors(FilesInterceptor('files', 30, imageOptions))
    async scanFile(
        @UploadedFiles()
        files: Express.Multer.File[],
        @Req() req: Request,
    ) {
        // type check
        if (files.length < 1) return failureResponse('at leatest one file', 'error.at_leatest_one_file');
        const fileScanResult = await this.uploadService.fileScan(files);
        if (!fileScanResult.data.CleanResult)
            throw new ApplicationErrorException(
                errorCodesExternal['E-00004'],
                'Virus found from at least one file',
                400,
            );
        files.forEach((file) => {
            if (!fileLimitTypeRegex.test(file.mimetype)) {
                throw new ApplicationErrorException(errorCodesExternal['E-00003'], 'File type not supported', 400);
            }
        });

        return successResponse({ message: `No virus detected` });
    }

    @Get('booking')
    async document(@Query() query: { referenceNo: string; UUID: string }) {
        const isTemp = query.referenceNo === undefined || query.referenceNo === null;
        const datas = await this.uploadService.getBookingFiles(isTemp ? query.UUID : query.referenceNo, isTemp);
        return successResponse(datas);
    }

    @Post('article')
    @UseInterceptors(FileInterceptor('file', imageOptions))
    async createArticleLink(
        @UploadedFile()
        file: Express.Multer.File,
    ) {
        const datas = await this.uploadService.createArticle(file);
        return successResponse({ Location: datas.Location });
    }
}
