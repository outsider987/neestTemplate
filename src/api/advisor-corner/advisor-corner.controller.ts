import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/api/auth/guard';
import { AdvisorCornerService } from './advisor-corner.service';

@Controller('advisor-corner')
export class AdvisorCornerController {
    constructor(private advisorCornerService: AdvisorCornerService) {}

    @Get('booking-history')
    @UseGuards(JwtGuard)
    getBookingHistory(@Query('agentCode') agentCode: string) {
        return this.advisorCornerService.getBookingHistory(agentCode);
    }

    @Get('health-points')
    @UseGuards(JwtGuard)
    getHealthPoints(@Query('agentCode') agentCode: string) {
        return this.advisorCornerService.getHealthPoints(agentCode);
    }

    @Get('redemption-list')
    @UseGuards(JwtGuard)
    getRedemptionList() {
        return this.advisorCornerService.getRedemptionList();
    }
}
