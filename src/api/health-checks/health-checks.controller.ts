import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { CacheService } from '../../cache/cache.service';
import { randomUUID } from 'crypto';
import Bugsnag from '@bugsnag/js';
import { promises as fsPromises, existsSync as fsExistsSync } from 'fs';
import { join } from 'path';

@Controller()
export class HealthChecksController {
    constructor(private cache: CacheService, private health: HealthCheckService, private db: TypeOrmHealthIndicator) {}

    @Get('/health-check')
    @HealthCheck()
    async check() {
        const errors = [];

        // Database Check
        const dbCheck = await this.health.check([() => this.db.pingCheck('database')]);
        const dbCheckResult = dbCheck.status === 'ok';
        if (!dbCheckResult) {
            errors['db'] = dbCheck.error;
        }

        // Cache Check
        const cacheCheckKey = 'health-check-cache-test';
        const randomString = randomUUID();
        const cacheSetCheck = await this.cache.set(cacheCheckKey, randomString, 5);
        const cacheSetCheckResult = cacheSetCheck === randomString;
        if (!cacheSetCheckResult) {
            errors['cache'] = cacheSetCheck;
        }
        const cacheGetCheckResult = (await this.cache.get(cacheCheckKey)) === randomString;

        // Git Branch
        const gitBranchFileName = 'git_branch.txt';
        const gitBranchFilePath = join(process.cwd(), 'dist/', gitBranchFileName);
        const gitBranch = fsExistsSync(gitBranchFilePath) ? await fsPromises.readFile(gitBranchFilePath, 'utf-8') : '';

        // Git Commit ID
        const gitCommitIDFileName = 'git_last_commit_hash.txt';
        const gitCommitIDFilePath = join(process.cwd(), 'dist/', gitCommitIDFileName);
        const gitCommitID = fsExistsSync(gitCommitIDFilePath)
            ? await fsPromises.readFile(gitCommitIDFilePath, 'utf-8')
            : '';

        // Build Time
        const buildTimeFileName = 'build_time.txt';
        const buildTimeFilePath = join(process.cwd(), 'dist/', buildTimeFileName);
        const buildTime = fsExistsSync(buildTimeFilePath) ? await fsPromises.readFile(buildTimeFilePath, 'utf-8') : '';

        return {
            success: errors.length === 0,
            db: dbCheckResult,
            cache: {
                driver: process.env.CACHE_DRIVER,
                read: cacheGetCheckResult,
                write: cacheSetCheckResult,
            },
            bugsnag: Bugsnag.isStarted(),
            gitBranch: gitBranch.trim(),
            gitCommitID: gitCommitID.trim(),
            buildTime: buildTime.trim(),
            errors,
        };
    }
}
