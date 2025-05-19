import { IsOptional, IsEnum, IsDateString, Min, IsInt } from 'class-validator';
import { EventStatus, EventStatusType, EventConst, EventType } from '@libs/constants';
import { Transform, Type } from 'class-transformer';

export class EventFilterDto {
  @IsOptional()
  @IsEnum(EventConst)
  type?: EventType;

  @IsOptional()
  @IsDateString()
  startAt?: string;

  @IsOptional()
  @IsDateString()
  endAt?: string;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatusType;

  @IsOptional()
  @Transform(({ value }) => (value === undefined ? 1 : Number(value)))
  @IsInt()
  page: number;

  @IsOptional()
  @Transform(({ value }) => (value === undefined ? 10 : Number(value)))
  @IsInt()
  limit: number;
}
