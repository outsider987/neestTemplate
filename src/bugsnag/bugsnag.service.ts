import { Injectable } from '@nestjs/common';
import Bugsnag from '@bugsnag/js';

@Injectable()
export class BugsnagService {
    constructor() {
        Bugsnag.start({
            apiKey: process.env.BUGSNAG_API_KEY,
            releaseStage: process.env.APP_ENV,
        });
    }
}
