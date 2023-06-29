import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from './cache/cache.module';
import { BugsnagModule } from './bugsnag/bugsnag.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { AuthModule } from './api/auth/auth.module';
import { HealthChecksModule } from './api/health-checks/health-checks.module';
import { UploadModule } from './api/upload/upload.module';
import { AgentModule } from './api/agent/agent.module';
import { MedicalKnowledgeModule } from './api/medical-knowledge/medical-knowledge.module';
import { SunHealthServiceModule } from './api/sun-health-service/sun-health-service.module';
import { AdvisorCornerModule } from './api/advisor-corner/advisor-corner.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            load: [configuration],
            envFilePath: '.env',
        }),
        BugsnagModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => configService.get('defaultConnection'),
            inject: [ConfigService],
        }),
        AuthModule,
        CacheModule,
        HealthChecksModule,
        UploadModule,
        AgentModule,
        MedicalKnowledgeModule,
        SunHealthServiceModule,
        AdvisorCornerModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(LoggerMiddleware).exclude({ path: '/health-check', method: RequestMethod.GET }).forRoutes('*');
    }
}
