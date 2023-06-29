import { ForbiddenException } from '@nestjs/common';
import { failureResponse } from '../utils/response';

export class CredentialsIncorrectException extends ForbiddenException {
    constructor() {
        super(failureResponse('Credentials incorrect', 'error.credentials_incorrect'));
    }
}
