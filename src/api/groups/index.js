import { EDGE_API, INVENTORY_API_BASE, getTableParams } from '../index';
import { instance } from '@redhat-cloud-services/frontend-components-utilities/interceptors/interceptors';

export const createGroup = (payload) => {
  return instance.post(`${EDGE_API}/device-groups/`, {
    Name: payload.name,
    Type: 'static',
  });
};

export const createInventoryGroup = (payload) => {
  return instance.post(`${INVENTORY_API_BASE}/groups`, { name: payload.name });
};

export const getGroups = ({ query }) => {
  const q = getTableParams(query);
  return instance.get(`${EDGE_API}/device-groups?${q}`);
};

export const getInventoryGroups = ({ query }) => {
  const q = getTableParams(query);
  return instance.get(`${INVENTORY_API_BASE}/groups?${q}`);
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

export const addDevicesToInventoryGroup = (groupId, devices) => {
  const devicesIDS = [];
  devices.forEach((device) => devicesIDS.push(device.UUID));

  return instance.post(
    `${INVENTORY_API_BASE}/groups/${groupId}/hosts`,
    devicesIDS
  );
};

export const removeDevicesFromGroup = (groupId, devices) => {
  return instance.delete(`${EDGE_API}/device-groups/${groupId}/devices`, {
    data: {
      ID: groupId,
      Devices: devices,
    },
  });
};

export const removeDevicesFromInventoryGroup = (groupId, devices) => {
  return instance.delete(
    `${INVENTORY_API_BASE}/groups/${groupId}/hosts/` + devices.join(',')
  );
};

export const removeDeviceFromGroupById = (groupId, id) => {
  return instance.delete(`${EDGE_API}/device-groups/${groupId}/devices/${id}`);
};

export const validateGroupName = (name) => {
  return instance.get(`${EDGE_API}/device-groups/checkName/${name}`);
};

export const getEnforceEdgeGroups = () => {
  return instance.get(`${EDGE_API}/device-groups/enforce-edge-groups`);
};

export const validateInventoryGroupName = (name) => {
  return instance.get(
    `${INVENTORY_API_BASE}/groups?name=${name}&order_by=name&order_how=ASC`
  );
};
