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

  @Transform(({ value }) => Number(value) || 1)
  @IsInt()
  @Min(1)
  page: number;

  @Transform(({ value }) => Number(value) || 10)
  @IsInt()
  @Min(1)
  limit: number;
}
