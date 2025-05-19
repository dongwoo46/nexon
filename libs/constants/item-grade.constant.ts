export const ItemGrade = {
  NORMAL: 'normal',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary',
  EVENT: 'event',
} as const;

export type ItemGradeType = (typeof ItemGrade)[keyof typeof ItemGrade];
