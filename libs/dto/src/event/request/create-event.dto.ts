import {
  IsArray,
  IsDateString,
  IsEnum,
  IsIn,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { Event, EventType } from '@libs/constants/event.constant';
import { EventStatus, EventStatusType } from '@libs/constants/event-status.constant';
import { Condition, ConditionType } from '@libs/constants';

export class CreateEventDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(Event)
  type: EventType;

  @IsIn(Object.values(EventStatus))
  status: EventStatusType;

  @IsDateString()
  startAt: Date;

  @IsDateString()
  endAt: Date;

  @IsArray()
  @IsMongoId({ each: true })
  rewards: string[];

  @IsArray()
  @IsEnum(Condition, { each: true })
  conditions: ConditionType[];
}
