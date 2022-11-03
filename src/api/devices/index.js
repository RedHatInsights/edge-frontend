import { EDGE_API, getTableParams } from '../index';
import { instance } from '@redhat-cloud-services/frontend-components-utilities/interceptors/interceptors';

export const getInventory = ({ query }) => {
  const q = getTableParams(query);
  return instance.get(`${EDGE_API}/devices/devicesview?${q}`);
};

export const getDeviceHasUpdate = async (id) => {
  try {
    return await instance.get(`${EDGE_API}/devices/${id}`);
  } catch (err) {
    // temp error solution
    console.log('');
  }
};

export const updateSystemToSpecificImage = async (payload) => {
  return await instance.post(`${EDGE_API}/updates`, payload);
};
