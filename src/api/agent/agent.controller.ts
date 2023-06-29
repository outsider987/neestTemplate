import { Body, Controller, Get, Post, Query, Req, UseGuards, Headers, Param, Put } from '@nestjs/common';
import { AgentService } from './agent.service';
import { Booking, CreateUpdateBookingDto, LoginDto, Membership, Provider, UpdateStatus, Doctor } from './dtos';
import { JwtGuard } from 'src/api/auth/guard';
import { Request } from 'express';
import { SuperAgentLoginDto } from './dtos/super-agent-login.dto';

@Controller('agent')
export class AgentController {
    constructor(private agentService: AgentService) {}

    @Post('auth/login')
    login(@Body() dto: LoginDto) {
        return this.agentService.login(dto);
    }

    @Post('auth/super/login')
    superAgentLogin(@Body() dto: SuperAgentLoginDto) {
        return this.agentService.superAgentLogin(dto);
    }

    @Get('membership')
    @UseGuards(JwtGuard)
    getMembership(@Query() query: Membership, @Req() req: Request) {
        return this.agentService.getMembership(query, req);
    }

    @Get('service-type')
    @UseGuards(JwtGuard)
    getServiceAndSymptomsTypes(@Query('planLevelCode') code: string, @Req() req: Request) {
        return this.agentService.getServiceAndSymptomsTypes(code, req);
    }

    @Get('service')
    @UseGuards(JwtGuard)
    getServiceAndSymptomsByType(@Query('medicalProcedureType') type: string, @Req() req: Request) {
        return this.agentService.getServiceAndSymptomsByType(type, req);
    }

    @Get('booking')
    @UseGuards(JwtGuard)
    getBookingRecords(@Query() query: Booking, @Req() req: Request) {
        return this.agentService.getBookingRecords(query, req);
    }

    @Get('location')
    @UseGuards(JwtGuard)
    getRegionAndLocation(@Query('serviceCode') serviceCode: string, @Req() req: Request) {
        return this.agentService.getRegionAndLocation(serviceCode, req);
    }

    @Get('provider')
    @UseGuards(JwtGuard)
    getProviders(@Query() query: Provider, @Req() req: Request) {
        return this.agentService.getProviders(query, req);
    }

    @Get('doctor')
    @UseGuards(JwtGuard)
    getDoctors(@Query() query: Doctor, @Req() req: Request) {
        return this.agentService.getDoctors(query, req);
    }

    @Post('booking')
    @UseGuards(JwtGuard)
    createBooking(@Body() dto: CreateUpdateBookingDto, @Headers('Authorization') auth: string) {
        return this.agentService.createOrUpdateBooking(dto, auth.replace('Bearer ', ''));
    }

    @Get('booking/:id/available-status')
    @UseGuards(JwtGuard)
    getAvailableStatus(@Param('id') id: string, @Req() req: Request) {
        return this.agentService.getAvailableStatus(id, req);
    }

    @Put('booking/:id/change-status')
    @UseGuards(JwtGuard)
    updateStatus(@Param('id') id: string, @Body() { status }: UpdateStatus, @Req() req: Request) {
        return this.agentService.updateStatus(id, status, req);
    }

    @Post('auth/logout')
    @UseGuards(JwtGuard)
    logOut(@Req() req: Request) {
        return this.agentService.logOut(req);
    }
}
