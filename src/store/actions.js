import {
  LOAD_GROUPS,
  LOAD_TRESHOLD,
  LOAD_DEVICES_INFO,
  LOAD_CANARIES_INFO,
} from './action-types';
import { fetchGroups, threshold, devicesInfo, canariesInfo } from '../api';

export const loadGroups = (perPage = 50, page = 1) => ({
  type: LOAD_GROUPS,
  payload: fetchGroups({ perPage, page }),
});

export const loadThreshold = () => ({
  type: LOAD_TRESHOLD,
  payload: threshold(),
});

export const loadDevicesInfo = () => ({
  type: LOAD_DEVICES_INFO,
  payload: devicesInfo(),
});

export const loadCanariesInfo = () => ({
  type: LOAD_CANARIES_INFO,
  payload: canariesInfo(),
});
