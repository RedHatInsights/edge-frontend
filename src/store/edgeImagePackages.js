import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { LOAD_EDGE_IMAGE_PACKAGES } from './action-types';

const initialState = {};

const loadEdgeImagePackagesPending = () => ({
  isLoading: true,
  hasError: false,
  data: null,
});

const loadEdgeImagePackagesFulfilled = (state, { payload }) => {
  return {
    ...state,
    isLoading: false,
    hasError: false,
    data: payload,
  };
};

const loadEdgeImagePackagesRejected = (state, { payload }) => ({
  ...state,
  isLoading: false,
  hasError: true,
  data: payload,
});

export default applyReducerHash(
  {
    [`${LOAD_EDGE_IMAGE_PACKAGES}_PENDING`]: loadEdgeImagePackagesPending,
    [`${LOAD_EDGE_IMAGE_PACKAGES}_FULFILLED`]: loadEdgeImagePackagesFulfilled,
    [`${LOAD_EDGE_IMAGE_PACKAGES}_REJECTED`]: loadEdgeImagePackagesRejected,
  },
  initialState
);
