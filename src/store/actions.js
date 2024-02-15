import {
  ACTION_TYPES,
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
  LOAD_EDGE_IMAGE_SETS,
  LOAD_EDGE_IMAGE_PACKAGES,
  LOAD_DEVICE_SUMMARY,
  LOAD_IMAGE_STATUS,
  LOAD_IMAGE_DETAIL,
  LOAD_IMAGE_SET_DETAIL,
  CREATE_NEW_IMAGE,
  POLLING_IMAGES,
  LOAD_DEVICE_TABLE,
} from './action-types';

import {
  fetchImageStatus,
  getImageById,
  fetchEdgeImages,
  fetchEdgeImageSets,
  getImagePackageMetadata,
  createImage,
  getImageSet,
  fetchActiveImages,
} from '../api/images';
import { getInventory } from '../api/devices';
import { hosts } from '../api';
import { deleteSystemsById } from '../utils';

export const loadThreshold = () => ({
  type: LOAD_TRESHOLD,
  payload: () => {},
});

export const loadDevicesInfo = () => ({
  type: LOAD_DEVICES_INFO,
  payload: () => {},
});

export const loadCanariesInfo = () => ({
  type: LOAD_CANARIES_INFO,
  payload: () => {},
});

export const loadGroupsDetail = () => ({
  type: LOAD_GROUP_DETAIL,
  payload: () => {},
});

export const loadGroupDevicesInfo = () => ({
  type: LOAD_GROUP_DEVICES_INFO,
  payload: () => {},
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
          title: 'Cannot show images data',
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
    payload: () => {},
    meta: {
      notifications: {
        rejected: {
          variant: 'danger',
          title: 'Cannot show system summary data',
          description: 'Failed receiving system summary data from inventory',
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

export const loadImageDetail = (dispatch, imageId) => {
  dispatch({
    type: LOAD_IMAGE_DETAIL,
    payload: getImageById({ id: imageId }),
  }).catch(() => null);
};

export const createNewImage = (dispatch, payload, callback) => {
  dispatch({
    type: CREATE_NEW_IMAGE,
    payload: createImage(payload),
  })
    .then(callback)
    .catch(() => null);
};

export const loadEdgeImages = (dispatch, query) => {
  dispatch({
    type: LOAD_EDGE_IMAGES,
    payload: fetchEdgeImages(query),
  }).catch(() => null);
};

export const loadEdgeImageSets = (dispatch, query) => {
  dispatch({
    type: LOAD_EDGE_IMAGE_SETS,
    payload: fetchEdgeImageSets(query),
  }).catch(() => null);
};

export const setPolling = (toStart, interval) => {
  const subAction = toStart ? 'START' : 'END';
  const payload = toStart ? { interval } : {};
  return {
    type: `${POLLING_IMAGES}_${subAction}`,
    ...payload,
  };
};

export const addImageToPoll = ({ id, name }) => {
  return {
    type: `${POLLING_IMAGES}_ADD`,
    payload: {
      name,
      id,
    },
  };
};

export const removeImagesToPoll = (ids) => {
  return {
    type: `${POLLING_IMAGES}_REMOVE`,
    ids,
  };
};

export const loadImageSetDetail = (dispatch, urlParam, query) => {
  dispatch({
    type: LOAD_IMAGE_SET_DETAIL,
    payload: getImageSet({ id: urlParam, q: query }),
  }).catch(() => null);
};

export const loadImagePackageMetadata = (dispatch, imageId) => {
  dispatch({
    type: LOAD_EDGE_IMAGE_PACKAGES,
    payload: getImagePackageMetadata(imageId),
  }).catch(() => null);
};

export const loadDeviceTable = (dispatch) => {
  dispatch({
    type: LOAD_DEVICE_TABLE,
    payload: getInventory(),
  }).catch(() => null);
};

export const editDisplayName = (id, value, origValue) => ({
  type: ACTION_TYPES.UPDATE_DISPLAY_NAME,
  payload: hosts.apiHostPatchHostById([id], { display_name: value }),
  meta: {
    id,
    value,
    origValue,
    notifications: {
      fulfilled: {
        variant: 'success',
        title: `Display name for entity with ID ${id} has been changed to ${value}`,
        dismissable: true,
      },
    },
  },
});

export const deleteEntity = (systems, displayName) => ({
  type: ACTION_TYPES.REMOVE_ENTITY,
  payload: deleteSystemsById(systems),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: 'Delete operation finished',
        description: `${displayName} has been successfully removed.`,
        dismissable: true,
      },
    },
    systems,
  },
});
