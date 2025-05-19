import { RewardRequestStatus, RewardRequestStatusType } from '@libs/constants';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsMongoId, IsEnum, IsInt, Min } from 'class-validator';

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

  @IsOptional()
  @Transform(({ value }) => (value === undefined ? 1 : Number(value)))
  @IsInt()
  page: number;

  @IsOptional()
  @Transform(({ value }) => (value === undefined ? 10 : Number(value)))
  @IsInt()
  limit: number;
}
