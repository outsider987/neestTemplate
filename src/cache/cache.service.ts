import { CACHE_MANAGER, Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
    constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

    public async get(key: string) {
        return this.cache.get(key);
    }

    public async set(key: string, value: string | number, seconds: number) {
        return await this.cache.set(key, value, { ttl: seconds });
    }

    public async remember(key: string, seconds: number, callback: any) {
        if (process.env.CACHE_ENABLED === 'true') {
            const cachedValues = await this.get(key);
            if (cachedValues) {
                return JSON.parse(<string>cachedValues);
            }

            const value = await callback.function();
            await this.set(key, JSON.stringify(value), seconds);
            return value;
        } else {
            return await callback.function();
        }
    }
}
