import { ForbiddenException } from '@nestjs/common';
import { failureResponse } from '../utils/response';

export class EmailUsedException extends ForbiddenException {
    constructor() {
        super(failureResponse('Email has been used', 'error.email_has_been_used'));
    }
}
