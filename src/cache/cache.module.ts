import { CacheModule as SystemCacheModule, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        SystemCacheModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => {
                const cache = config.get('cache');
                if (cache.driver === 'redis') {
                    return {
                        ttl: cache.ttl,
                        store: redisStore,
                        host: cache.host,
                        port: cache.port,
                    };
                }
                return {
                    ttl: cache.ttl,
                };
            },
            inject: [ConfigService],
        }),
    ],
    providers: [CacheService],
    exports: [CacheService],
})
export class CacheModule {}
