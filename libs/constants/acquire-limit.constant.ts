export const AcquireLimit = {
  NONE: 0, // 제한 없음
  ONCE: 1, // 1회
  DAILY: 2, // 하루 1회
  WEEKLY: 3, // 주 1회
} as const;

export type AcquireLimitType = (typeof AcquireLimit)[keyof typeof AcquireLimit];
