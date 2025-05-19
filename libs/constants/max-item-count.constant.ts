import { ItemGradeType } from './item-grade.constant';

export const MaxItemCountByGrade: Record<ItemGradeType, number> = {
  normal: Infinity, // 무제한 등록 가능
  rare: 100,
  epic: 50,
  legendary: 5,
  event: 20,
};
