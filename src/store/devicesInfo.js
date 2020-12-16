import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/esm/ReducerRegistry';
import { LOAD_DEVICES_INFO } from './action-types';

const initialState = {};

const loadDevicesInfoPending = (state) => ({
  ...state,
  devicesInfo: {},
  isLoading: true,
});
const loadDevicesInfoFulfilled = (state, { payload }) => ({
  ...state,
  devicesInfo: payload?.results,
  isLoading: false,
});

export default applyReducerHash(
  {
    [`${LOAD_DEVICES_INFO}_PENDING`]: loadDevicesInfoPending,
    [`${LOAD_DEVICES_INFO}_FULFILLED`]: loadDevicesInfoFulfilled,
  },
  initialState
);
