import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { CREATE_NEW_IMAGE } from './action-types';

const initialState = {};

const createNewImagePending = () => ({
  isLoading: true,
  hasError: false,
  error: null,
});

const createNewImageFulfilled = () => {
  return {
    isLoading: false,
    hasError: false,
    error: null,
  };
};

const createNewImageRejected = (_state, { payload }) => ({
  isLoading: false,
  hasError: true,
  error: payload,
});

const createNewImageReset = () => ({
  isLoading: false,
  hasError: false,
  error: null,
});

export default applyReducerHash(
  {
    [`${CREATE_NEW_IMAGE}_PENDING`]: createNewImagePending,
    [`${CREATE_NEW_IMAGE}_FULFILLED`]: createNewImageFulfilled,
    [`${CREATE_NEW_IMAGE}_REJECTED`]: createNewImageRejected,
    [`${CREATE_NEW_IMAGE}_RESET`]: createNewImageReset,
  },
  initialState
);
