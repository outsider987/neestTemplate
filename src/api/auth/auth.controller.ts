import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dtos';
import { successResponse } from '../../utils/response';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        const { accessToken } = await this.authService.register(dto);
        return successResponse({
            accessToken,
        });
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() dto: LoginDto) {
        const { accessToken } = await this.authService.login(dto);
        return successResponse({
            accessToken,
        });
    }
}
