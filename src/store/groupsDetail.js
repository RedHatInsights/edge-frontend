import React from 'react';
import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/esm/ReducerRegistry';
import { LOAD_GROUP_DETAIL } from './action-types';
import { StatusIcon } from '../components';

const initialState = {};

const loadGroupsPending = (state) => ({
  ...state,
  isLoading: true,
});
const loadGroupsFulfilled = (state, { payload }) => ({
  ...state,
  isLoading: false,
  name: payload?.name,
  uuid: payload?.uuid,
  devices: payload?.results,
  meta: payload?.meta || {},
});

const onEntitiesLoaded = (state) => {
  const [name, updated] =
    state?.columns?.filter(
      ({ key }) => key === 'display_name' || key === 'updated'
    ) || [];
  return {
    ...state,
    columns: [
      name,
      { key: 'version', title: 'Version' },
      updated,
      {
        key: 'status',
        title: 'Status',
        // eslint-disable-next-line react/display-name
        renderFunc: (status) => {
          return <StatusIcon status={status} />;
        },
      },
    ],
    loaded: true,
  };
};

export const systemsList = ({ LOAD_ENTITIES_FULFILLED }) =>
  applyReducerHash({
    [LOAD_ENTITIES_FULFILLED]: onEntitiesLoaded,
  });

export default applyReducerHash(
  {
    [`${LOAD_GROUP_DETAIL}_PENDING`]: loadGroupsPending,
    [`${LOAD_GROUP_DETAIL}_FULFILLED`]: loadGroupsFulfilled,
  },
  initialState
);
