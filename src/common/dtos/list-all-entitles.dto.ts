import { IsString, IsIn, IsInt, IsPositive, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { order, Order } from '../../utils/sql';

export class ListAllEntities {
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Transform(({ value }) => parseInt(value))
    limit: number;

    @IsOptional()
    @IsInt()
    @IsPositive()
    @Transform(({ value }) => parseInt(value))
    offset: number;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.toUpperCase())
    @IsIn(order)
    order: Order;
}
