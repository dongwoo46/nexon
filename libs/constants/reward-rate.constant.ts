export const RewardGrade = {
  COMMON: 'COMMON',
  RARE: 'RARE',
  EPIC: 'EPIC',
  LEGENDARY: 'LEGENDARY',
  ONLY: 'ONLY',
} as const;

export type RewardGradeType = (typeof RewardGrade)[keyof typeof RewardGrade];
