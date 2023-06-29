import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../entities';
import { CacheModule } from '../../cache/cache.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [CacheModule, TypeOrmModule.forFeature([Users])],
    exports: [UsersService],
})
export class UsersModule {}
