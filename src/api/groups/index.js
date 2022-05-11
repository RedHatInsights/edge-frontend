import { EDGE_API, getTableParams } from '../index';
import { instance } from '@redhat-cloud-services/frontend-components-utilities/interceptors/interceptors';

export const createGroup = (payload) => {
  return instance.post(`${EDGE_API}/device-groups/`, {
    Name: payload.name,
    Type: 'static',
  });
};

export const getGroups = ({ query }) => {
  const q = getTableParams(query);
  return instance.get(`${EDGE_API}/device-groups?${q}`);
};

export const getGroupById = ({ id, query }) => {
  const q = getTableParams(query);
  return instance.get(`${EDGE_API}/device-groups/${id}/view?${q}`);
};

export const updateGroupById = (id, payload) => {
  return instance.put(`${EDGE_API}/device-groups/${id}`, {
    Name: payload.name,
    Type: 'static',
  });
};

export const deleteGroupById = (id) => {
  return instance.delete(`${EDGE_API}/device-groups/${id}`);
};

export const addDevicesToGroup = (groupId, devices) => {
  return instance.post(`${EDGE_API}/device-groups/${groupId}/devices`, {
    ID: groupId,
    Devices: devices,
  });
};

export const removeDevicesFromGroup = (groupId, devices) => {
  return instance.delete(`${EDGE_API}/device-groups/${groupId}/devices`, {
    data: {
      ID: groupId,
      Devices: devices,
    },
  });
};

export const removeDeviceFromGroupById = (groupId, id) => {
  return instance.delete(`${EDGE_API}/device-groups/${groupId}/devices/${id}`);
};

export const validateGroupName = (name) => {
  return instance.get(`${EDGE_API}/device-groups/checkName/${name}`);
};
