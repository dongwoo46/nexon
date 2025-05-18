export type EventType =
  | 'attendance' // 누적 출석 이벤트
  | 'continuous' // 연속 출석 이벤트
  | 'point' // 포인트 사용 이벤트
  | 'collection'; // 아이템 수집 이벤트
