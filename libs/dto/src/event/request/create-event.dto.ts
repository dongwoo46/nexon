import {
  IsArray,
  IsDate,
  IsDateString,
  IsEnum,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EventConst, EventType } from '@libs/constants/event.constant';
import { EventStatus, EventStatusType } from '@libs/constants/event-status.constant';
import { Condition, ConditionType } from '@libs/constants';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(EventConst)
  type: EventType;

  @IsEnum(EventStatus)
  status: EventStatusType;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startAt: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endAt: Date;

  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  rewards: string[];

  @IsArray()
  @IsEnum(Condition, { each: true })
  @IsNotEmpty()
  conditions: ConditionType[];
}
