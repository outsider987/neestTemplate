import { IsOptional, IsString } from 'class-validator';

export class Membership {
    @IsString()
    @IsOptional()
    policyOwnerNameEng;

    @IsString()
    @IsOptional()
    policyOwnerNameChi;

    @IsString()
    @IsOptional()
    nameEn;

    @IsString()
    @IsOptional()
    nameZh;

    @IsString()
    @IsOptional()
    productNameEn;

    @IsString()
    @IsOptional()
    productNameZh;

    @IsString()
    @IsOptional()
    policyNumber;

    @IsString()
    @IsOptional()
    agentId;

    @IsString()
    @IsOptional()
    planLevelCode;

    @IsString()
    @IsOptional()
    categoryCode;

    @IsString()
    @IsOptional()
    pageNum;

    @IsString()
    @IsOptional()
    pageSize;
}
