import keyBy from 'lodash/keyBy';
import flatMap from 'lodash/flatMap';

export const LOAD_GROUPS = 'LOAD_GROUPS';
export const LOAD_GROUP_DETAIL = 'LOAD_GROUP_DETAIL';
export const LOAD_TRESHOLD = 'LOAD_TRESHOLD';
export const LOAD_DEVICES_INFO = 'LOAD_DEVICES_INFO';
export const LOAD_CANARIES_INFO = 'LOAD_CANARIES_INFO';
export const LOAD_GROUP_DEVICES_INFO = 'LOAD_GROUP_DEVICES_INFO';

const asyncActions = flatMap(
  [
    LOAD_GROUPS,
    LOAD_GROUP_DETAIL,
    LOAD_TRESHOLD,
    LOAD_DEVICES_INFO,
    LOAD_CANARIES_INFO,
  ],
  (a) => [a, `${a}_PENDING`, `${a}_FULFILLED`, `${a}_REJECTED`]
);
export const ACTION_TYPES = keyBy(asyncActions, (k) => k);
