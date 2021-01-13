import ReducerRegistry from '@redhat-cloud-services/frontend-components-utilities/files/esm/ReducerRegistry';

export const createRegistry = (
  initialState = {},
  middleware = [],
  composeEnhancersDefault
) => {
  return new ReducerRegistry(
    initialState,
    [...middleware],
    composeEnhancersDefault
  );
};
