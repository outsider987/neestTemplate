import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthChecksController } from './health-checks.controller';
import { CacheModule } from '../../cache/cache.module';

@Module({
    controllers: [HealthChecksController],
    imports: [TerminusModule, CacheModule],
})
export class HealthChecksModule {}
