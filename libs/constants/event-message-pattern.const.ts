export const EventMessagePatternConst = {
  // 이벤트
  EVENT_CREATED: 'event.create', // 운영자가 새로운 이벤트 생성
  EVENT_UPDATED: 'event.update', // 이벤트 수정
  EVENT_DELETED: 'event.delete', // 이벤트 삭제
  EVENT_LIST: 'event.list',
  EVENT_DETAIL: 'event.detail',
  EVENT_EVALUATE_CONDITIONS: 'event.evaluate_conditions', // 이벤트 조건 평가

  // 아이템
  ITEM_CREATED: 'item.create', // 아이템 생성
  ITEM_UPDATED: 'item.update', // 아이템 수정
  ITEM_DELETED: 'item.delete', // 아이템 삭제
  ITEM_READ: 'item.read', // 아이템 조회

  // 보상
  REWARD_CREATED: 'reward.create',

  // 보상요청
  REWARD_REQUEST_CREATED: 'reward-request.create',
  REWARD_REQUEST_LIST_BY_USER: 'reward-request.user-list',
  REWARD_REQUEST_LIST_ALL: 'reward-request.admin-list',
  REWARD_REQUEST_DETAIL: 'reward-request.detail',
  REWARD_REQUEST_UPDATE: 'reward-request.update',
} as const;

export type EventMessagePattern =
  (typeof EventMessagePatternConst)[keyof typeof EventMessagePatternConst];
