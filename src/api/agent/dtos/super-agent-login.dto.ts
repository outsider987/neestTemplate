import { IsNotEmpty, IsString } from 'class-validator';

export class SuperAgentLoginDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
