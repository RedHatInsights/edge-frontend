import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/esm/ReducerRegistry';
import { SELECT_ENTITY, PRE_SELECT_ENTITY } from './action-types';

const entitySelected = (state, { payload }) => {
  const selected = state.selected || new Map();
  if (payload.selected) {
    if (payload.id === 0) {
      state.rows.forEach((row) => selected.set(row.id, row));
    } else {
      const selectedRow = state?.rows?.find(({ id } = {}) => id === payload.id);
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

const loadEntitiesFulfilled = (state) => {
  return {
    ...state,
    rows: state.rows.map(({ id, ...row }) => ({
      id,
      ...row,
      selected: !!state.selected?.get(id),
    })),
  };
};

export const entitiesReducer = ({ LOAD_ENTITIES_FULFILLED }) =>
  applyReducerHash({
    [SELECT_ENTITY]: entitySelected,
    [PRE_SELECT_ENTITY]: entitySelected,
    [LOAD_ENTITIES_FULFILLED]: loadEntitiesFulfilled,
  });
