import { IsOptional, IsString } from 'class-validator';

export class CreateTempFilesDto {
    @IsString()
    @IsOptional()
    policyNumber: string;
}
