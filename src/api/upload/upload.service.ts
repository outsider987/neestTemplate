import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { CreateTempFilesInterface, S3BucketInterface } from './interfaces/upload.interface';
import { localLog } from 'src/utils/logger';
import configuration from 'src/config/configuration';
import { ApplicationErrorException } from 'src/exceptions';
import errorCodesExternal from 'src/config/errorCodesExternal';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingFiles } from 'src/entities/bookingFiles';
import { Repository } from 'typeorm';
import { CreateBookingFilesDto } from './dtos/createBookingFiles.dto';
import * as moment from 'moment';
import { hashS3Path } from 'src/utils/hash';
import axios from 'axios';
import * as FormData from 'form-data';
import { Readable } from 'stream';
import { Agents } from 'src/entities/agents.entity';
import { Request } from 'express';

const s3ConfigType = configuration().s3Config;
const createPrevPath = 'booking/create';
const createArticlePath = 'article/create';
const tempBookingPath = 'booking/temp_booking';
@Injectable()
export class UploadService {
    constructor(
        private config: ConfigService,
        @InjectRepository(BookingFiles) private bookingFilesRepo: Repository<BookingFiles>,
        @InjectRepository(Agents) private agentsRepo: Repository<Agents>,
    ) {
        this.s3Config = this.config.get('s3Config');
        this.s3 = new AWS.S3({
            accessKeyId: this.s3Config.AWS_S3_ACCESS_KEY,
            secretAccessKey: this.s3Config.AWS_S3_KEY_SECRET,
            region: 'ap-east-1',
        });
    }
    private s3Config: typeof s3ConfigType;
    private s3: AWS.S3;

    async s3Upload(params: {
        Bucket: string;
        Key: string;
        Body: Buffer;
        ContentType: string;
        ContentDisposition: string;
    }) {
        try {
            const { s3 } = this;

            return new Promise(async function (resolve, reject) {
                await s3.upload(params, function (s3Err, data) {
                    if (s3Err) {
                        reject(s3Err);
                    }
                    if (!data || !data.Location) {
                        reject(new ApplicationErrorException(errorCodesExternal['E-00001']));
                    }

                    localLog(`File uploaded successfully at ${data.Location}`);
                    resolve(data);
                });
            });
        } catch (error) {
            localLog(error);
            throw new ApplicationErrorException(errorCodesExternal['E-00001']);
        }
    }
    async s3Delete(key: string) {
        const { bookingFilesRepo } = this;

        try {
            const params = { Bucket: this.s3Config.AWS_S3_BUCKET, Key: key };
            localLog('Start delete s3 ============================');
            const data = await this.s3.deleteObject(params).promise();

            localLog('End delete s3 ============================');

            // bookingFilesRepo.delete({ key: key });
            localLog(data.RequestCharged);
            return data;
        } catch (error) {
            localLog('failed delete s3 ============================');
            localLog(error);
            throw new ApplicationErrorException(errorCodesExternal['E-00002']);
        }
    }
    async fileScan(files: Express.Multer.File[]) {
        const CLOUDMERSIVE_API_KEY = this.config.get('hmg.cloud_mersive_api_key');
        let result;

        for (const [index, file] of files.entries()) {
            const form = new FormData();
            form.append('file', Readable.from(file.buffer), {
                filename: file.originalname,
            });
            console.time(`scan ${index} time`);
            const res = await axios.post('https://api.cloudmersive.com/virus/scan/file', form, {
                headers: {
                    // 'Content-Type': 'multipart/form-data',
                    ...form.getHeaders(),
                    ApiKey: CLOUDMERSIVE_API_KEY,
                },
            });
            console.timeEnd(`scan ${index} time`);
            if (!res.data.CleanResult) throw new ApplicationErrorException(errorCodesExternal['E-00004']);
            result = res;
        }

        return result;
    }
    async updateBookingFiles(files: Express.Multer.File[], dtos: CreateBookingFilesDto, req: Request) {
        const { AWS_S3_BUCKET } = this.s3Config;

        const bucketParams = {
            Bucket: AWS_S3_BUCKET,
            Prefix: `${createPrevPath}/${hashS3Path(dtos.referenceNo)}/`,
        };
        const datas = await this.s3.listObjects(bucketParams).promise();
        await Promise.all(
            datas.Contents.map(async (object) => {
                try {
                    await this.s3Delete(object.Key);
                } catch (err) {
                    console.log(err);
                }
            }),
        );
        /* for (const object of datas.Contents) {
            const res = await this.s3Delete(object.Key);
        } */

        return await this.createBookingFiles(files, dtos, req);
    }

    async createTempFiles(files: Express.Multer.File[], UUID: string) {
        const uploadFilePromises = [];
        localLog('Start upload s3 ============================');
        files.forEach((file) => {
            const params = {
                Bucket: this.s3Config.AWS_S3_BUCKET,
                Key: `${tempBookingPath}/${String(UUID)}/${String(file.originalname)}`.trim(),
                Body: file.buffer,
                ContentType: file.mimetype,
                ContentDisposition: 'inline',
            };

            uploadFilePromises.push(this.s3Upload(params));
        });

        const updateSucessDatas = await Promise.all<S3BucketInterface>(uploadFilePromises);
        localLog('End upload s3 ============================');
        return updateSucessDatas;
    }

    async createBookingFiles(files: Express.Multer.File[], dtos: CreateBookingFilesDto, req: Request) {
        const uploadFilePromises = [];
        const tableDatas = [];
        const hashRefNo = hashS3Path(dtos.referenceNo);
        const token = req.headers['authorization'].split(' ')[1];

        const agent = await this.agentsRepo.findOne({
            where: {
                agentCode: dtos.agentCode,
            },
        });

        if (agent == null || agent.token !== token || agent.isSuper) {
            // Agent login record not found in DB, or
            // Agent token is not equal, or
            // Agent is Super agent
            throw new Error('Agent error');
        }

        for (const file of files) {
            const fileType = file.originalname.match(/\.\w+$/);
            const newFileName = `${dtos.referenceNo}-${moment().format('DDMMYYYYhhmmssSSS')}${fileType}`;
            tableDatas.push({
                bucket: this.s3Config.AWS_S3_BUCKET,
                key: `${createPrevPath}/${hashRefNo}/${newFileName}`,
                referenceNo: dtos.referenceNo,
                policyNumber: dtos.policyNumber,
                fileName: newFileName,
                contentType: file.mimetype,
            });
        }
        // create db datas first
        localLog('Start insert db ============================');
        const res = await this.bookingFilesRepo.save(tableDatas);
        localLog(res);
        localLog('End insert db ============================');
        try {
            localLog('Start upload s3 ============================');
            files.forEach((file) => {
                const fileType = file.originalname.match(/\.\w+$/);
                const newFileName = `${dtos.referenceNo}-${moment().format('DDMMYYYYhhmmssSSS')}${fileType}`;
                const params = {
                    Bucket: this.s3Config.AWS_S3_BUCKET,
                    Key: `${createPrevPath}/${hashRefNo}/${newFileName}`.trim(),
                    Body: file.buffer,
                    ContentType: file.mimetype,
                    ContentDisposition: 'inline',
                };

                uploadFilePromises.push(this.s3Upload(params));
            });

            const updateSucessDatas = await Promise.all<S3BucketInterface>(uploadFilePromises);

            localLog('End upload s3 ============================');

            return updateSucessDatas;
        } catch (error) {
            if (error == 'Agent Error') {
                console.log('Agent error');
                return;
            }
            localLog('Start delete files db data ============================');
            const erroRes = await this.bookingFilesRepo.delete(res);
            console.log(erroRes);
            localLog('End delete files db data ============================');
        }
    }

    async getBookingFiles(key: string, isTemp = false) {
        const { AWS_S3_BUCKET, AWS_S3_PREFIX } = this.s3Config;

        const bucketParams = {
            Bucket: AWS_S3_BUCKET,
            Prefix: `${isTemp ? `${tempBookingPath}/${key}` : `${createPrevPath}/${hashS3Path(key)}/`}`,
        };
        const datas = await this.s3.listObjects(bucketParams).promise();

        return await datas.Contents.map((data) => {
            return `${AWS_S3_PREFIX}/${data.Key}`;
        });
    }

    async createArticle(file: Express.Multer.File) {
        const uploadFilePromises = [];
        const s3 = this.s3;
        try {
            localLog('Start upload s3 of article ============================');

            const params = {
                Bucket: this.s3Config.AWS_S3_BUCKET,
                Key: `${createArticlePath}/${file.originalname}${moment()
                    .format('YYYY-MM-DD HH:mm:ss')
                    .toString()}`.trim(),
                Body: file.buffer,
                ContentType: file.mimetype,
                ContentDisposition: 'inline',
            };
            uploadFilePromises.push(this.s3Upload(params));
            const updateSucessDatas = await Promise.all<S3BucketInterface>(uploadFilePromises);

            localLog('End upload s3 of article ============================');
            return updateSucessDatas[0];
        } catch (error) {
            console.log(error);
        }
    }
}
