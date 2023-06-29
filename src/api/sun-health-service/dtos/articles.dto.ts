import { IsNumber, IsOptional, IsString } from "class-validator";

export class ArticlesDto {
    @IsString()
    @IsOptional()
    serviceType: number;

    @IsString()
    @IsOptional()
    productType: number;
}