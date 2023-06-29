import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import Bugsnag from '@bugsnag/js';
import { failureResponse } from '../utils/response';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const request = context.getRequest<Request>();

        // General Error Message of Unhandled Exceptions
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let jsonResponse: string | object = failureResponse('Something went wrong', 'error.something_went_wrong');

        // Handled Exceptions
        if (exception.getStatus && exception.getResponse) {
            status = exception.getStatus();
            jsonResponse = exception.getResponse();
        } else {
            // Send all Unhandled Exceptions to Bugsnag
            Bugsnag.addMetadata('request', request);
            Bugsnag.addMetadata('response', response);
            Bugsnag.notify(exception);
            console.log(exception);

            if (process.env.APP_ENV !== 'production') {
                jsonResponse['exception'] = exception.message ?? exception;
            }
        }

        response.status(status).json(jsonResponse);
    }
}
