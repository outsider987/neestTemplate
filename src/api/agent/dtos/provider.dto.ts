import { IsNotEmpty, IsString } from 'class-validator';

export class Provider {
    @IsString()
    @IsNotEmpty()
    locationCode;

    @IsString()
    @IsNotEmpty()
    serviceCode;

    @IsString()
    @IsNotEmpty()
    bookingPlanLevelCode;
}
