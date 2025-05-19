import { RewardRequestStatus, RewardRequestStatusType } from '@libs/constants';
import { IsOptional, IsMongoId, IsEnum } from 'class-validator';

export class RewardRequestFilterDto {
  @IsOptional()
  @IsMongoId()
  user?: string;

  @IsOptional()
  @IsMongoId()
  event?: string;

  @IsOptional()
  @IsEnum(RewardRequestStatus)
  status?: RewardRequestStatusType;
}
