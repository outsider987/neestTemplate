import { HttpException, HttpStatus } from '@nestjs/common';
import { failureResponse } from '../utils/response';
import errorCodesExternal from '../config/errorCodesExternal';

export class ApplicationErrorException extends HttpException {
    constructor(
        errorCode: typeof errorCodesExternal['E-00000'],
        remarks?,
        httpStatusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    ) {
        super(failureResponse(errorCode.messageEn, errorCode.code, remarks), httpStatusCode);
    }
}
