import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { LOAD_EDGE_IMAGE_SETS } from './action-types';

const initialState = {};

const loadEdgeImageSetsPending = () => ({
  isLoading: true,
  hasError: false,
  data: null,
});

const loadEdgeImageSetsFulfilled = (state, { payload }) => {
  return {
    ...state,
    isLoading: false,
    hasError: false,
    data: payload,
  };
};

const loadEdgeImageSetsRejected = (state, { payload }) => ({
  ...state,
  isLoading: false,
  hasError: true,
  data: payload,
});

export default applyReducerHash(
  {
    [`${LOAD_EDGE_IMAGE_SETS}_PENDING`]: loadEdgeImageSetsPending,
    [`${LOAD_EDGE_IMAGE_SETS}_FULFILLED`]: loadEdgeImageSetsFulfilled,
    [`${LOAD_EDGE_IMAGE_SETS}_REJECTED`]: loadEdgeImageSetsRejected,
  },
  initialState
);
