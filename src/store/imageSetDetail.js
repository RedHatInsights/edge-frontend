import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { LOAD_IMAGE_SET_DETAIL } from './action-types';

const initialState = {};

const loadImageSetDetailPending = () => ({
  isLoading: true,
  hasError: false,
  data: null,
});

const loadImageSetDetailFulfilled = (state, { payload }) => {
  return {
    ...state,
    isLoading: false,
    hasError: false,
    data: payload,
  };
};

const loadImageSetDetailRejected = () => ({
  isLoading: false,
  hasError: true,
  data: 'No image set detail to view',
});

export default applyReducerHash(
  {
    [`${LOAD_IMAGE_SET_DETAIL}_PENDING`]: loadImageSetDetailPending,
    [`${LOAD_IMAGE_SET_DETAIL}_FULFILLED`]: loadImageSetDetailFulfilled,
    [`${LOAD_IMAGE_SET_DETAIL}_REJECTED`]: loadImageSetDetailRejected,
  },
  initialState
);
