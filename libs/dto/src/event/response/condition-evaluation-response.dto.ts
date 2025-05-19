import { ConditionType } from '@libs/constants';

export class ConditionEvaluationResultDto {
  condition?: ConditionType;
  passed: boolean;
  message?: string;
}
