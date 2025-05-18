import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsDate,
  IsDefined,
} from 'class-validator';
import { ItemType, ItemGradeType, AcquireLimitType } from '@libs/constants';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  itemKey: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: ItemType;

  @IsString()
  @IsNotEmpty()
  grade: ItemGradeType;

  @IsBoolean()
  @IsDefined()
  usable: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  effect?: string;

  @IsOptional()
  @IsDate()
  expiresAt?: Date;
}
