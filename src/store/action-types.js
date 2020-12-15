import keyBy from 'lodash/keyBy';
import flatMap from 'lodash/flatMap';

export const LOAD_GROUPS = 'LOAD_GROUPS';
export const LOAD_GROUP_DETAIL = 'LOAD_GROUP_DETAIL';

const asyncActions = flatMap([LOAD_GROUPS, LOAD_GROUP_DETAIL], (a) => [
  a,
  `${a}_PENDING`,
  `${a}_FULFILLED`,
  `${a}_REJECTED`,
]);
export const ACTION_TYPES = keyBy(asyncActions, (k) => k);
