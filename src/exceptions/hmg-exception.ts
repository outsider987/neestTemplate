import { HttpException, HttpStatus } from '@nestjs/common';
import hmgErrorCodes from 'src/config/hmgErrorCodes';

export class HmgErrorException extends HttpException {
    constructor(errorCode: keyof typeof hmgErrorCodes, httpStatusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR) {
        super({ error: { message: hmgErrorCodes[errorCode].message } }, httpStatusCode);
    }
}
