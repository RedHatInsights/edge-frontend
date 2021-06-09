import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { LOAD_IMAGE_STATUS } from './action-types';

const initialState = {};

const loadImageStatusPending = () => ({
  isLoading: true,
  hasError: false,
  data: null,
});

const loadImageStatusFulfilled = (state, { payload }) => {
  return {
    ...state,
    isLoading: false,
    hasError: false,
    data: payload,
  };
};

const loadImageStatusRejected = () => ({
  isLoading: false,
  hasError: true,
  data: 'No image status to view',
});

export default applyReducerHash(
  {
    [`${LOAD_IMAGE_STATUS}_PENDING`]: loadImageStatusPending,
    [`${LOAD_IMAGE_STATUS}_FULFILLED`]: loadImageStatusFulfilled,
    [`${LOAD_IMAGE_STATUS}_REJECTED`]: loadImageStatusRejected,
  },
  initialState
);
