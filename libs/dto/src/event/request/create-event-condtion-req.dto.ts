import {
  Condition,
  ConditionOperator,
  ConditionOperatorType,
  ConditionType,
} from '@libs/constants';
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateEventConditionReqDto {
  @IsIn(Object.values(Condition))
  type: ConditionType;

  @IsIn(Object.values(ConditionOperator))
  operator: ConditionOperatorType;

  @IsNotEmpty()
  @ValidateIf((o) => typeof o.value === 'string')
  @IsString()
  @ValidateIf((o) => typeof o.value === 'number')
  @IsNumber()
  value: number | string;

  @IsOptional()
  @IsString()
  itemKey?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
