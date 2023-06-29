import { IsOptional, IsString } from 'class-validator';

export class Booking {
    @IsString()
    @IsOptional()
    memberId;

    @IsString()
    @IsOptional()
    status;

    @IsString()
    @IsOptional()
    symptomsType;

    @IsString()
    @IsOptional()
    policyNumber;

    @IsString()
    @IsOptional()
    insuredNameEng;

    @IsString()
    @IsOptional()
    insuredNameChi;

    @IsString()
    @IsOptional()
    productNameEng;

    @IsString()
    @IsOptional()
    referenceNo;

    @IsString()
    @IsOptional()
    pageNum;

    @IsString()
    @IsOptional()
    pageSize;

    @IsOptional()
    random;
}
