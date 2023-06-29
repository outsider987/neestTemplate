import { Module } from '@nestjs/common';
import { BugsnagService } from './bugsnag.service';

@Module({
    providers: [BugsnagService],
    exports: [BugsnagService],
})
export class BugsnagModule {}
