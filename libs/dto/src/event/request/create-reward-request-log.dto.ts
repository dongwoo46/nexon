import { IsMongoId, IsString, IsIn, IsOptional, IsObject } from 'class-validator';
import { EventAction, EventActionType } from '@libs/constants';
import {
  RewardRequestLogStatus,
  RewardRequestLogStatusType,
} from '@libs/constants/reward-log.constant';

export class CreateRewardRequestLogDto {
  @IsMongoId()
  user: string;

  @IsMongoId()
  event: string;

  @IsIn(Object.values(EventAction))
  action: EventActionType;

  @IsIn(Object.values(RewardRequestLogStatus))
  status: RewardRequestLogStatusType;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
