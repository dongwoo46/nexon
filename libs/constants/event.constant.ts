export const Event = {
  ATTENDANCE: 'attendance', // 누적 출석 이벤트
  CONTINUOUS: 'continuous', // 연속 출석 이벤트
  POINT: 'point', // 포인트 사용 이벤트
  COLLECTION: 'collection', // 아이템 수집 이벤트
} as const;

export type EventType = (typeof Event)[keyof typeof Event];
