import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUpdateBookingDto {
    @IsNumber()
    @IsNotEmpty()
    agentId;

    @IsString()
    @IsOptional()
    agentNameEng;

    @IsString()
    @IsOptional()
    agentNameChi;

    @IsString()
    @IsNotEmpty()
    clientNameEng;

    @IsString()
    @IsOptional()
    clientNameChi;

    @IsString()
    @IsOptional()
    notiContactNumber;

    @IsString()
    @IsNotEmpty()
    policyNumber;

    @IsString()
    @IsNotEmpty()
    dateOfBirth;

    @IsString()
    @IsOptional()
    gender;

    @IsString()
    @IsNotEmpty()
    planLevelCode;

    @IsString()
    @IsNotEmpty()
    symptomProcedureCode;

    @IsString()
    @IsNotEmpty()
    symptomsType;

    @IsString()
    @IsNotEmpty()
    person;

    @IsString()
    @IsNotEmpty()
    personNameEng;

    @IsString()
    @IsNotEmpty()
    personNumber;

    @IsString()
    preferredRegion;

    @IsString()
    preferredRegionCode;

    @IsString()
    preferredLocation;

    @IsString()
    preferredLocationCode;

    @IsString()
    preferredDoctorNameEng;

    @IsString()
    preferredDoctorNameChi;

    @IsString()
    @IsNotEmpty()
    firstPreferredDate;

    @IsString()
    @IsNotEmpty()
    firstPreferredTime;

    @IsString()
    @IsOptional()
    secondPreferredDate;

    @IsString()
    @IsOptional()
    secondPreferredTime;

    @IsString()
    @IsOptional()
    action;

    @IsNumber()
    @IsOptional()
    originalBookingId;

    @IsString()
    @IsNotEmpty()
    preferredPosCode;

    @IsString()
    @IsOptional()
    symptomsDescription;

    @IsString()
    @IsOptional()
    preferredDocCode;

    @IsString()
    @IsOptional()
    identityNumber;

    @IsString()
    @IsOptional()
    remainingMiscEn;

    @IsString()
    @IsOptional()
    remainingMiscTc;

    @IsString()
    @IsOptional()
    remainingMiscSc;

    @IsString()
    @IsOptional()
    oppTitleEn;

    @IsString()
    @IsOptional()
    oppTitleTc;

    @IsString()
    @IsOptional()
    oppTitleSc;

    @IsString()
    @IsOptional()
    policyEffectiveDate;

    @IsString()
    @IsOptional()
    preferredDoctorGender;
}
