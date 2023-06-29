import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AdvisorBookingHistory } from 'src/entities/advisor-booking-history.entity';
import { AdvisorHealthPoints } from 'src/entities/advisor-health-points.entity';
import { HealthPointRedemptionList } from 'src/entities/health-point-redemption-list.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdvisorCornerService {
    constructor(
        private config: ConfigService,
        @InjectRepository(AdvisorBookingHistory) private bookingHistoryRepo: Repository<AdvisorBookingHistory>,
        @InjectRepository(AdvisorHealthPoints) private healthPointsRepo: Repository<AdvisorHealthPoints>,
        @InjectRepository(HealthPointRedemptionList)
        private healthPointRedemptionRepo: Repository<HealthPointRedemptionList>,
    ) {}

    async getBookingHistory(agentCode: string) {
        try {
            const result = await this.bookingHistoryRepo.find({
                where: {
                    agentCode,
                },
                relations: {
                    serviceType: true,
                },
            });
            return {
                status: 200,
                data: {
                    result,
                },
            };
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getHealthPoints(agentCode: string) {
        try {
            const result = await this.healthPointsRepo.find({
                where: {
                    agentCode,
                },
            });
            return {
                status: 200,
                data: {
                    result,
                },
            };
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getRedemptionList() {
        try {
            const result = await this.healthPointRedemptionRepo.find();
            return {
                status: 200,
                data: {
                    result,
                },
            };
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
