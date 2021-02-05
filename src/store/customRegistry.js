import ReducerRegistry from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';

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
