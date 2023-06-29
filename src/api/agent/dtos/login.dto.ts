import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    token: string;

    @IsString()
    @IsOptional()
    agentCode: string;
}
