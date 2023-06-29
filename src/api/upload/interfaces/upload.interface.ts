export interface S3BucketInterface {
    ETag: number;
    Location: string;
    key: string;
    Bucket: string;
}

export interface CreateTempFilesInterface {
    policyNumber: string;
    UUID: string;
}

export interface CreateBookingFilesInterface {
    policyNumber: string;
    referenceNo: string;
    UUID: string;
}
