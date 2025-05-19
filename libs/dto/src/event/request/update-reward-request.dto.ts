import { IsArray, IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { RewardRequestStatus, RewardRequestStatusType } from '@libs/constants';
import { Types } from 'mongoose';

export class UpdateRewardRequestDto {
  @IsEnum(RewardRequestStatus)
  status: RewardRequestStatusType;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true }) // 각 요소가 ObjectId 형식인지 검사
  rewards?: Types.ObjectId[];
}

export class UpdateRewardRequestPayloadDto extends UpdateRewardRequestDto {
  id: string;
}
