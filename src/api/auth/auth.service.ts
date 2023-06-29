import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto, RegisterDto } from './dtos';
import { DataSource, QueryFailedError } from 'typeorm';
import { CredentialsIncorrectException, EmailUsedException } from '../../exceptions';
import { getTableName as getTableNameFromQuery } from '../../utils/sql';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private jwt: JwtService,
        private config: ConfigService,
        private dataSource: DataSource,
        private usersService: UsersService,
    ) {}

    async register(registerDto: RegisterDto) {
        const saltRounds = 10;
        const hash = await bcrypt.hash(registerDto.password, saltRounds);

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const user = await queryRunner.manager.save(
                await this.usersService.createEntity({
                    email: registerDto.email,
                    password: hash,
                    nameCn: registerDto.nameCn,
                    nameEn: registerDto.nameEn,
                }),
            );

            await queryRunner.commitTransaction();
            return this.signToken(user.id, user.email);
        } catch (error) {
            await queryRunner.rollbackTransaction();

            if (error instanceof QueryFailedError) {
                const tableName = getTableNameFromQuery(error.query);
                if (tableName === this.usersService.getTableName() && error.driverError.errno === 1062) {
                    throw new EmailUsedException();
                }
            }

            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findOneBy({
            email: dto.email,
        });
        if (!user) {
            throw new CredentialsIncorrectException();
        }

        const passwordMatches = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatches) {
            throw new CredentialsIncorrectException();
        }

        return this.signToken(user.id, user.email);
    }

    async signToken(userId: number, email: string): Promise<{ accessToken: string }> {
        const payload = {
            sub: userId,
            email,
        };
        const secret = this.config.get('jwt.secret');
        const token = await this.jwt.signAsync(payload, {
            expiresIn: this.config.get('jwt.expirationTime'),
            secret: secret,
        });

        return {
            accessToken: token,
        };
    }
}
