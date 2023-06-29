import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateStatus {
    @IsString()
    @IsNotEmpty()
    status;
}
