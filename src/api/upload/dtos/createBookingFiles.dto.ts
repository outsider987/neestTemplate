import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookingFilesDto {
    @IsString()
    @IsOptional()
    referenceNo: string;

    @IsString()
    @IsOptional()
    policyNumber: string;

    @IsString()
    @IsNotEmpty()
    agentCode: string;
}
