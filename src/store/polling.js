import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { POLLING_IMAGES } from './action-types';

const initialState = {};

const addImageToPoll = (state, { payload: { id } }) => ({
  ...state,
  [id]: 'BUILDING',
});

const removeImageToPoll = (state, { ids }) => {
  const newState = state;
  ids.forEach((id) => {
    delete newState[id];
  });
  return newState;
};

export default applyReducerHash(
  {
    [`${POLLING_IMAGES}_ADD`]: addImageToPoll,
    [`${POLLING_IMAGES}_REMOVE`]: removeImageToPoll,
  },
  initialState
);
