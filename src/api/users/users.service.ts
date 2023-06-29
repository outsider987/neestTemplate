import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { UsersInterface } from './interfaces/users.interface';
import { Users } from '../../entities';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        private dataSource: DataSource,
        @InjectRepository(Users)
        private usersRepo: Repository<Users>,
    ) {}

    async list(order: 'ASC' | 'DESC', offset: number, limit: number): Promise<UsersInterface[]> {
        return await this.usersRepo.createQueryBuilder().orderBy('id', order).offset(offset).limit(limit).getMany();
    }

    async getById(id: number): Promise<UsersInterface> {
        return await this.usersRepo.createQueryBuilder().where('id = :id', { id: id }).getOne();
    }

    async findOneBy(where: FindOptionsWhere<Users>) {
        return this.usersRepo.findOneBy(where);
    }

    getTableName(): string {
        return this.dataSource.getMetadata(Users).tableName;
    }

    async createEntity(dto: CreateUserDto) {
        return this.usersRepo.create({
            email: dto.email,
            password: dto.password,
            nameCn: dto.nameCn,
            nameEn: dto.nameEn,
        });
    }
}
