import {
  IsMongoId,
  IsOptional,
  IsString,
  IsIn,
  IsNotEmpty,
  IsArray,
  IsEnum,
} from 'class-validator';
import { RewardRequestStatus, RewardRequestStatusType } from '@libs/constants';

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
  @IsEnum(RewardRequestStatus)
  status: RewardRequestStatusType;

  @IsOptional()
  @IsString()
  content?: string;
}
