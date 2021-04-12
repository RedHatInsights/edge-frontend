import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { LOAD_CANARIES_INFO } from './action-types';

const initialState = {};

const loadCanariesInfoPending = (state) => ({
  ...state,
  canariesInfo: [],
  isLoading: true,
});
const loadCanariesInfoFulfilled = (state, { payload }) => ({
  ...state,
  canariesInfo: payload?.results || [],
  isLoading: false,
});

export default applyReducerHash(
  {
    [`${LOAD_CANARIES_INFO}_PENDING`]: loadCanariesInfoPending,
    [`${LOAD_CANARIES_INFO}_FULFILLED`]: loadCanariesInfoFulfilled,
  },
  initialState
);
