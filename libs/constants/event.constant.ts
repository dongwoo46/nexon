export const EventConst = {
  ATTENDANCE_TOTAL: 'ATTENDANCE_TOTAL', // 누적 출석 이벤트
  ATTENDANCE_CONTINUOUS: 'ATTENDANCE_CONTINUOUS', // 연속 출석 이벤트
  POINT_USED: 'POINT_USED', // 포인트 사용 이벤트
  ITEM_COLLECTION: 'ITEM_COLLECTION', // 아이템 수집 이벤트
  DAILY_ATTENDANCE: 'DAILY_ATTENDANCE', // 일일 출석 이벤트
} as const;

export type EventType = (typeof Event)[keyof typeof Event];
