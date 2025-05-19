import { IsOptional, IsMongoId, IsEnum } from 'class-validator';
import { RewardStatus, RewardStatusType } from '@libs/constants';

export class RewardRequestFilterDto {
  @IsOptional()
  @IsMongoId()
  user?: string;

  @IsOptional()
  @IsMongoId()
  event?: string;

  @IsOptional()
  @IsEnum(RewardStatus)
  status?: RewardStatusType;
}
