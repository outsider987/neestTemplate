import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { SuperAgent } from 'src/entities/super-agent.entity';
import { ServiceType } from 'src/entities/service-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Agents } from 'src/entities/agents.entity';

@Module({
    providers: [AgentService],
    controllers: [AgentController],
    imports: [TypeOrmModule.forFeature([SuperAgent, ServiceType, Agents]), ConfigModule],
})
export class AgentModule {}
