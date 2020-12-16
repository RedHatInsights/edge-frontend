import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/esm/ReducerRegistry';
import { LOAD_GROUP_DETAIL } from './action-types';

const initialState = {};

const loadGroupsPending = (state) => ({
  ...state,
  devices: [],
  isLoading: true,
});
const loadGroupsFulfilled = (state, { payload }) => ({
  ...state,
  isLoading: false,
  name: payload?.name,
  uuid: payload?.uuid,
  devices: payload?.results,
  meta: payload?.meta || {},
});

export default applyReducerHash(
  {
    [`${LOAD_GROUP_DETAIL}_PENDING`]: loadGroupsPending,
    [`${LOAD_GROUP_DETAIL}_FULFILLED`]: loadGroupsFulfilled,
  },
  initialState
);
