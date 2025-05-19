import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsMongoId,
  IsNumber,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

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
