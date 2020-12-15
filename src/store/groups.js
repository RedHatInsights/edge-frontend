import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/esm/ReducerRegistry';
import { LOAD_GROUPS } from './action-types';

const initialState = {};

const loadGroupsPending = (state) => ({
  ...state,
  groups: [],
  isLoading: true,
});
const loadGroupsFulfilled = (state, { payload }) => ({
  ...state,
  isLoading: false,
  groups: payload?.results || [],
  meta: payload?.meta || {},
});

export default applyReducerHash(
  {
    [`${LOAD_GROUPS}_PENDING`]: loadGroupsPending,
    [`${LOAD_GROUPS}_FULFILLED`]: loadGroupsFulfilled,
  },
  initialState
);
