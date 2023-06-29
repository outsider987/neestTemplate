import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as logger from '../utils/logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(request: Request, response: Response, next: NextFunction) {
        const startAt = process.hrtime();

        // Generate Random Reference ID
        global.requestId = logger.generateRequestId(request);

        // Log Request Details
        logger.event({
            method: request.method,
            url: request.originalUrl,
            query: Object.keys(request.query).length > 0 ? request.query : undefined,
            body: Object.keys(request.body).length > 0 ? request.body : undefined,
            ip: request.ip,
            userAgent: request.get('user-agent'),
            headers: request.headers,
        });

        next();

        // Log Response Details
        const send = response.send;
        response.send = (responseBody) => {
            const diff = process.hrtime(startAt);
            logger.event({
                response: JSON.parse(responseBody),
                statusCode: response.statusCode,
                responseTime: (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2) + 'ms'
            });
            response.send = send;
            return response.send(responseBody);
        };
    }
}
