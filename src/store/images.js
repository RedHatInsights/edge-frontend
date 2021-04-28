import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { LOAD_ACTIVE_IMAGES } from './action-types';

const initialState = {};

const loadActiveImagesPending = () => ({
  isLoading: true,
  hasError: false,
  data: null,
});

const loadActiveImagesFulfilled = (state, { payload }) => {
  return {
    ...state,
    isLoading: false,
    hasError: false,
    data: payload,
  };
};

const loadActiveImagesRejected = () => ({
  isLoading: false,
  hasError: true,
  data: 'No images to view',
});

export default applyReducerHash(
  {
    [`${LOAD_ACTIVE_IMAGES}_PENDING`]: loadActiveImagesPending,
    [`${LOAD_ACTIVE_IMAGES}_FULFILLED`]: loadActiveImagesFulfilled,
    [`${LOAD_ACTIVE_IMAGES}_REJECTED`]: loadActiveImagesRejected,
  },
  initialState
);
