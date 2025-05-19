export const ItemConst = {
  // NORMAL
  HP_POTION_SMALL: 'hp_potion_small', // 소형 HP 회복 포션
  TELEPORT_SCROLL: 'teleport_scroll', // 지역 이동 주문서

  // RARE
  MESO_POUCH: 'meso_pouch', // 메소 꾸러미
  HAIR_COUPON: 'hair_coupon', // 헤어 변경 쿠폰

  // EPIC
  ICE_WAND: 'ice_wand', // 얼음 속성 마법봉
  DAMAGE_SKIN_STAR: 'damage_skin_star', // 별 이펙트 데미지 스킨

  // LEGENDARY
  FIRE_SWORD: 'fire_sword', // 불 속성 검
  PET_MILO: 'pet_milo', // 한정판 펫

  // EVENT
  ANGEL_WINGS_CHAIR: 'angel_wings_chair', // 날개 의자
  PINK_BEAN_HAT: 'pink_bean_hat', // 핑크빈 모자
} as const;

export type ItemType = (typeof ItemConst)[keyof typeof ItemConst];
