import { IsMongoId, IsOptional, IsString, IsIn, IsNotEmpty, IsArray } from 'class-validator';
import { RewardStatus, RewardStatusType } from '@libs/constants';

export class CreateRewardRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  user: string;

  @IsNotEmpty()
  @IsMongoId()
  event: string;

  @IsArray()
  @IsMongoId({ each: true })
  rewards: string[];

  @IsNotEmpty()
  @IsIn(Object.values(RewardStatus))
  status: RewardStatusType;

  @IsOptional()
  @IsString()
  content?: string;
}
