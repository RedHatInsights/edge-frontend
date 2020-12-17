import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/esm/ReducerRegistry';
import { LOAD_GROUP_DEVICES_INFO } from './action-types';

const initialState = {};

const loadGroupDevicesInfoPending = (state) => ({
  ...state,
  devicesInfo: {},
  isLoading: true,
});
const loadGroupDevicesInfoFulfilled = (state, { payload }) => ({
  ...state,
  devicesInfo: payload,
  isLoading: false,
});

export default applyReducerHash(
  {
    [`${LOAD_GROUP_DEVICES_INFO}_PENDING`]: loadGroupDevicesInfoPending,
    [`${LOAD_GROUP_DEVICES_INFO}_FULFILLED`]: loadGroupDevicesInfoFulfilled,
  },
  initialState
);
