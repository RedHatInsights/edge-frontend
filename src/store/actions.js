import { LOAD_GROUPS } from './action-types';
import { fetchGroups } from '../api';

export const loadGroups = (perPage = 50, page = 1) => ({
  type: LOAD_GROUPS,
  payload: fetchGroups({ perPage, page }),
});
