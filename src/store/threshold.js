import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { LOAD_TRESHOLD } from './action-types';

const initialState = {};

const loadThresholdPending = (state) => ({
  ...state,
  threshold: {},
  isLoading: true,
});
const loadThresholdFulfilled = (state, { payload }) => ({
  ...state,
  threshold: payload?.results || {},
  isLoading: false,
});

export default applyReducerHash(
  {
    [`${LOAD_TRESHOLD}_PENDING`]: loadThresholdPending,
    [`${LOAD_TRESHOLD}_FULFILLED`]: loadThresholdFulfilled,
  },
  initialState
);
