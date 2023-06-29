import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './exceptions/all-exception.filter';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });
    app.use(helmet());
    app.useGlobalPipes(
        new ValidationPipe({
            stopAtFirstError: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            // exceptionFactory: (errors) => new ValidationException(errors),
        }),
    );
    app.enableCors();
    app.useGlobalFilters(new AllExceptionFilter());
    await app.listen(3000);
}

bootstrap();
