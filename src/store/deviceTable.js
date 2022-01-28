import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { LOAD_DEVICE_TABLE } from './action-types';

const initialState = {};

const loadDeviceTablePending = () => ({
  isLoading: true,
  hasError: false,
  data: null,
});

const loadDeviceTableFulfilled = (state, { payload }) => {
  return {
    ...state,
    isLoading: false,
    hasError: false,
    data: payload,
  };
};

const loadDeviceTableRejected = (state, { payload }) => ({
  ...state,
  isLoading: false,
  hasError: true,
  data: payload,
});

export default applyReducerHash(
  {
    [`${LOAD_DEVICE_TABLE}_PENDING`]: loadDeviceTablePending,
    [`${LOAD_DEVICE_TABLE}_FULFILLED`]: loadDeviceTableFulfilled,
    [`${LOAD_DEVICE_TABLE}_REJECTED`]: loadDeviceTableRejected,
  },
  initialState
);
