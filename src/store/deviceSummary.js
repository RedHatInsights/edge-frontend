import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { LOAD_DEVICE_SUMMARY } from './action-types';

const initialState = {};

const loadDeviceSummaryPending = () => ({
  isLoading: true,
  hasError: false,
  data: null,
});

const loadDeviceSummaryFulfilled = (state, { payload }) => {
  return {
    ...state,
    isLoading: false,
    hasError: false,
    data: payload,
  };
};

const loadDeviceSummaryRejected = () => ({
  isLoading: false,
  hasError: true,
  data: 'No device summary data to view',
});

export default applyReducerHash(
  {
    [`${LOAD_DEVICE_SUMMARY}_PENDING`]: loadDeviceSummaryPending,
    [`${LOAD_DEVICE_SUMMARY}_FULFILLED`]: loadDeviceSummaryFulfilled,
    [`${LOAD_DEVICE_SUMMARY}_REJECTED`]: loadDeviceSummaryRejected,
  },
  initialState
);
