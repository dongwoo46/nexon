import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsDate,
  IsDefined,
  IsIn,
  IsEnum,
} from 'class-validator';
import { ItemType, ItemGradeType, ItemConst, ItemGrade } from '@libs/constants';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  itemKey: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(ItemConst)
  type: ItemType;

  @IsNotEmpty()
  @IsEnum(ItemGrade)
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
