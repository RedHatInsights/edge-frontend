import { EDGE_API, getTableParams } from '../index';
import { instance } from '@redhat-cloud-services/frontend-components-utilities/interceptors/interceptors';

export const getInventory = ({ query }) => {
  const q = getTableParams(query);
  return instance.get(`${EDGE_API}/devices/devicesview?${q}`);
};

export const getDevice = (id) => {
  return instance.get(`${EDGE_API}/devices/${id}`);
};

export const getDeviceUpdates = ({ id, query }) => {
  const q = getTableParams(query);
  return instance.get(`${EDGE_API}/devices/${id}?${q}`);
};

export const updateSystem = async (payload) => {
  return await instance.post(`${EDGE_API}/updates`, payload);
};
