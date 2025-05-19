import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsMongoId,
  IsNumber,
  Min,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EventConst, EventType } from '@libs/constants';

class RewardItemDto {
  @IsMongoId()
  item: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateRewardDto {
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(EventConst)
  rewardKey: EventType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsMongoId()
  @IsNotEmpty()
  event: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RewardItemDto)
  items?: RewardItemDto[];
}
