import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class Doctor {
    @IsString()
    @IsNotEmpty()
    providerCode;

    @IsString()
    @IsOptional()
    procedureCode;
}
