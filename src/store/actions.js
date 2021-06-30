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
  LOAD_ACTIVE_IMAGES,
  LOAD_EDGE_IMAGES,
  LOAD_DEVICE_SUMMARY,
  LOAD_IMAGE_STATUS,
  CREATE_NEW_IMAGE,
} from './action-types';
import {
  fetchGroups,
  threshold,
  devicesInfo,
  canariesInfo,
  groupsDetail,
  groupDevicesInfo,
  fetchActiveImages,
  fetchDeviceSummary,
  fetchImageStatus,
  fetchEdgeImages,
  sortImageColunm,
  createImage,
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

export const loadImages = (dispatch, pagination) => {
  dispatch({
    type: LOAD_ACTIVE_IMAGES,
    payload: fetchActiveImages(pagination),
    meta: {
      notifications: {
        rejected: {
          variant: 'danger',
          title: 'Can not show images data',
          description: 'Failed receiving images from image-builder',
        },
      },
    },
    // the '.catch' part is necessary because redux-promise-middleware throws the error on REJECTED
    // and to avoid the app exploding I need to catch it here.
    // THANK you redux-promise-middleware for not allowing to customize this behavior. 😠
  }).catch(() => null);
};

export const loadDeviceSummary = (dispatch) => {
  dispatch({
    type: LOAD_DEVICE_SUMMARY,
    payload: fetchDeviceSummary,
    meta: {
      notifications: {
        rejected: {
          variant: 'danger',
          title: 'Can not show device summary data',
          description: 'Failed receiving device summary data from inventory',
        },
      },
    },
    // the '.catch' part is necessary because redux-promise-middleware throws the error on REJECTED
    // and to avoid the app exploding I need to catch it here.
    // THANK you redux-promise-middleware for not allowing to customize this behavior. 😠
  }).catch(() => null);
};

export const loadImageStatus = (dispatch, imageId) => {
  dispatch({
    type: LOAD_IMAGE_STATUS,
    payload: fetchImageStatus({ id: imageId }),
  }).catch(() => null);
};

export const createNewImage = (dispatch, payload, callback) => {
  dispatch({
    type: CREATE_NEW_IMAGE,
    payload: createImage(payload),
  })
    .then(() => callback())
    .catch(() => null);
};

export const loadEdgeImages = (dispatch, query) => {
  dispatch({
    type: LOAD_EDGE_IMAGES,
    payload: fetchEdgeImages(query),
  }).catch(() => null);
};

export const sortEdgeImages = (dispatch, query) => {
  dispatch({
    type: LOAD_EDGE_IMAGES,
    payload: sortImageColunm(query),
  }).catch(() => null);
};
