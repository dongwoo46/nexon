export const Condition = {
  ATTENDANCE: 'attendance',
  CONTINUOUS_ATTENDANCE: 'continuousAttendance',
  POINTS: 'points',
  USED_POINTS: 'usedPoints',
  ITEM_COLLECTED: 'itemCollected',
  LOGIN_COUNT: 'loginCount',
} as const;

export type ConditionType = (typeof Condition)[keyof typeof Condition];
