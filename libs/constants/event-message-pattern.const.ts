export const EventMessagePatternConst = {
  // 이벤트
  EVENT_CREATED: 'event.create', // 운영자가 새로운 이벤트 생성
  EVENT_UPDATED: 'event.update', // 이벤트 수정
  EVENT_DELETED: 'event.delete', // 이벤트 삭제

  // 이벤트 조건
  EVENT_CONDITION_CREATE: 'event-condition.create',
} as const;

export type EventMessagePattern =
  (typeof EventMessagePatternConst)[keyof typeof EventMessagePatternConst];
