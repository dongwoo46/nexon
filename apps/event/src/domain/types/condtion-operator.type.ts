export const ConditionOperator = {
  EQUALS: 'equals',
  GREATER_THAN_OR_EQUAL: 'greaterThanOrEqual',
  LESS_THAN_OR_EQUAL: 'lessThanOrEqual',
  LESS_THAN: 'lessThan',
  GREATER_THAN: 'greaterThan',
  INCLUDES: 'includes',
} as const;

export type ConditionOperatorType = (typeof ConditionOperator)[keyof typeof ConditionOperator];
