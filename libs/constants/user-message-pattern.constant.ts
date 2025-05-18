export const UserMessagePatternConst = {
  USER_SIGNUP: 'user.signup',
  USER_LOGIN: 'user.login',
} as const;

export type UserMessagePatternKey = keyof typeof UserMessagePatternConst;
export type UserMessagePatternValue = (typeof UserMessagePatternConst)[UserMessagePatternKey];
