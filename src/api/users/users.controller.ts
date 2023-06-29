import { Headers, Query, Param, Controller, Get, ValidationPipe, UseGuards } from '@nestjs/common';
import constants from '../../config/constants';
import { CacheService } from '../../cache/cache.service';
import { JwtGuard } from '../auth/guard';
import { UsersService } from './users.service';

@UseGuards(JwtGuard)
@Controller()
export class UsersController {
    private readonly cacheMinutes;

    constructor(private cache: CacheService, private usersService: UsersService) {
        this.cacheMinutes = constants.cache.minutes.clinics;
    }
}
