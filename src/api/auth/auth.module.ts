import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';
import { UsersModule } from '../users/users.module';
import { UploadModule } from 'src/api/upload/upload.module';

@Module({
    imports: [JwtModule.register({}), UsersModule, UploadModule],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
