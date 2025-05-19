export const ConditionCategory = {
  ATTENDANCE: 'attendance',
  CONTINUOUS_ATTENDANCE: 'continuousAttendance',
  POINTS: 'points',
  USED_POINT: 'usedPoint',
  ITEM: 'item',
  LOGIN: 'login',
} as const;

export type ConditionCategoryType = (typeof ConditionCategory)[keyof typeof ConditionCategory];
