import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdvisorBookingHistory } from 'src/entities/advisor-booking-history.entity';
import { AdvisorHealthPoints } from 'src/entities/advisor-health-points.entity';
import { HealthPointRedemptionList } from 'src/entities/health-point-redemption-list.entity';
import { AdvisorCornerController } from './advisor-corner.controller';
import { AdvisorCornerService } from './advisor-corner.service';

@Module({
    controllers: [AdvisorCornerController],
    providers: [AdvisorCornerService],
    imports: [
        TypeOrmModule.forFeature([AdvisorBookingHistory, AdvisorHealthPoints, HealthPointRedemptionList]),
        ConfigModule,
    ],
    exports: [AdvisorCornerService],
})
export class AdvisorCornerModule {}
