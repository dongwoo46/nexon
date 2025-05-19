import { IsArray, IsDate, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { RewardRequestStatus, RewardRequestStatusType } from '@libs/constants';

export class RewardRequestSummaryDto {
  @IsString()
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  eventName?: string;

  @IsArray()
  @IsString({ each: true }) // 배열 내 원소가 string인지 검사
  rewards: string[];

  @IsEnum(RewardRequestStatus)
  status: RewardRequestStatusType;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;
}
