import { HttpException, HttpStatus } from '@nestjs/common';
import { failureResponse } from '../utils/response';

export class RecordNotFoundException extends HttpException {
    constructor() {
        super(failureResponse('Record not found', 'error.record.not_found'), HttpStatus.NOT_FOUND);
    }
}
