import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { LOAD_EDGE_IMAGES } from './action-types';

const initialState = {};

const loadEdgeImagesPending = () => ({
  isLoading: true,
  hasError: false,
  data: null,
});

const loadEdgeImagesFulfilled = (state, { payload }) => {
  return {
    ...state,
    isLoading: false,
    hasError: false,
    data: payload,
  };
};

const loadEdgeImagesSorted = (state, { payload }) => ({
  ...state,
  isLoading: false,
  hasError: true,
  data: payload,
});

const loadEdgeImagesRejected = (state, { payload }) => ({
  ...state,
  isLoading: false,
  hasError: true,
  data: payload,
});

export default applyReducerHash(
  {
    [`${LOAD_EDGE_IMAGES}_PENDING`]: loadEdgeImagesPending,
    [`${LOAD_EDGE_IMAGES}_FULFILLED`]: loadEdgeImagesFulfilled,
    [`${LOAD_EDGE_IMAGES}_SORTED`]: loadEdgeImagesSorted,
    [`${LOAD_EDGE_IMAGES}_REJECTED`]: loadEdgeImagesRejected,
  },
  initialState
);
