import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { LOAD_IMAGE_DETAIL } from './action-types';

const initialState = {};

const loadImageDetailPending = () => ({
  isLoading: true,
  hasError: false,
  data: null,
});

const loadImageDetailFulfilled = (state, { payload }) => {
  return {
    ...state,
    isLoading: false,
    hasError: false,
    data: payload,
  };
};

const loadImageDetailRejected = () => ({
  isLoading: false,
  hasError: true,
  data: 'No image status to view',
});

export default applyReducerHash(
  {
    [`${LOAD_IMAGE_DETAIL}_PENDING`]: loadImageDetailPending,
    [`${LOAD_IMAGE_DETAIL}_FULFILLED`]: loadImageDetailFulfilled,
    [`${LOAD_IMAGE_DETAIL}_REJECTED`]: loadImageDetailRejected,
  },
  initialState
);
