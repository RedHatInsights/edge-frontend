import {
  LOAD_GROUPS,
  LOAD_TRESHOLD,
  LOAD_DEVICES_INFO,
  LOAD_CANARIES_INFO,
  LOAD_GROUP_DETAIL,
  LOAD_GROUP_DEVICES_INFO,
  SELECT_ENTITY,
  PRE_SELECT_ENTITY,
  CLEAN_ENTITIES,
} from './action-types';
import {
  fetchGroups,
  threshold,
  devicesInfo,
  canariesInfo,
  groupsDetail,
  groupDevicesInfo,
} from '../api';

export const loadGroups = (perPage = 50, page = 1) => ({
  type: LOAD_GROUPS,
  payload: fetchGroups({ perPage, page }),
});

export const loadThreshold = () => ({
  type: LOAD_TRESHOLD,
  payload: threshold(),
});

export const loadDevicesInfo = (systemsCount) => ({
  type: LOAD_DEVICES_INFO,
  payload: devicesInfo(systemsCount),
});

export const loadCanariesInfo = () => ({
  type: LOAD_CANARIES_INFO,
  payload: canariesInfo(),
});

export const loadGroupsDetail = (uuid, page, perPage) => ({
  type: LOAD_GROUP_DETAIL,
  payload: groupsDetail(uuid, { page, perPage }),
});

export const loadGroupDevicesInfo = (uuid) => ({
  type: LOAD_GROUP_DEVICES_INFO,
  payload: groupDevicesInfo(uuid),
});

export const selectEntity = (id, selected) => ({
  type: SELECT_ENTITY,
  payload: {
    id,
    selected,
  },
});

export const preSelectEntity = (id, selected) => ({
  type: PRE_SELECT_ENTITY,
  payload: {
    id,
    selected,
  },
});

export const cleanEntities = () => ({
  type: CLEAN_ENTITIES,
});
