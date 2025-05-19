export const EventMessagePatternConst = {
  // 이벤트
  EVENT_CREATED: 'event.create', // 운영자가 새로운 이벤트 생성
  EVENT_UPDATED: 'event.update', // 이벤트 수정
  EVENT_DELETED: 'event.delete', // 이벤트 삭제
  EVENT_READ: 'event.read', // 이벤트 조회

  // 아이템
  ITEM_CREATED: 'item.create', // 아이템 생성
  ITEM_UPDATED: 'item.update', // 아이템 수정
  ITEM_DELETED: 'item.delete', // 아이템 삭제
  ITEM_READ: 'item.read', // 아이템 조회

  // 보상
  REWARD_CREATED: 'reward.create',
} as const;

export type EventMessagePattern =
  (typeof EventMessagePatternConst)[keyof typeof EventMessagePatternConst];
