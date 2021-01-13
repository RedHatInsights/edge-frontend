import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/esm/ReducerRegistry';
import { SELECT_ENTITY } from './action-types';

const entitySelected = (state, { payload }) => {
  const selected = state.selected || new Map();
  if (payload.selected) {
    if (payload.id === 0) {
      state.rows.forEach((row) => selected.set(row.id, row));
    } else {
      const selectedRow =
        state.rows && state.rows.find(({ id }) => id === payload.id);
      selected.set(payload.id, { ...(selectedRow || {}), id: payload.id });
    }
  } else {
    if (payload.id === 0) {
      state.rows.forEach((row) => selected.delete(row.id));
    } else if (payload.id === -1) {
      selected.clear();
    } else {
      selected.delete(payload.id);
    }
  }

  return {
    ...state,
    selected: new Map(selected),
  };
};

export const entitiesReducer = () =>
  applyReducerHash({
    [SELECT_ENTITY]: entitySelected,
  });
