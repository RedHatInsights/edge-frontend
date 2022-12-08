import { EDGE_API, IMAGE_BUILDER_API, getTableParams } from '../index';
import { instance } from '@redhat-cloud-services/frontend-components-utilities/interceptors/interceptors';

export const checkImageName = (name) => {
  const payload = {
    name,
  };
  return instance.post(`${EDGE_API}/images/checkImageName`, payload);
};

export const fetchImageStatus = ({ id }) => {
  return instance.get(`${EDGE_API}/images/${id}/status`);
};

export const fetchActiveImages = ({ limit = 100, offset = 0 } = {}) => {
  return instance.get(
    `${IMAGE_BUILDER_API}/composes?limit=${limit}&offset=${offset}`
  );
};

export const createImage = ({
  Id,
  name,
  version,
  description,
  release,
  architecture,
  username,
  credentials,
  imageType: imageTypes,
  'selected-packages': packages,
  'third-party-repositories': thirdPartyRepositories,
  'custom-packages': customPackages,
}) => {
  let [imageType] = imageTypes || [];
  if (imageTypes.length > 1) {
    imageType = 'rhel-edge-installer';
  }
  const payload = {
    name,
    version,
    description,
    distribution: release,
    imageType: imageType,
    packages: packages.map((item) => ({ name: item.name })),
    outputTypes: imageTypes,
    commit: {
      arch: architecture,
    },
    installer: {
      username,
      sshkey: credentials,
    },
    thirdPartyRepositories: thirdPartyRepositories?.map((repo) => ({
      ID: repo.id,
      Name: repo.name,
      URL: repo.URL,
    })),
    customPackages: customPackages?.map((repo) => ({ Name: repo.name })),
  };

  let endpoint = `${EDGE_API}/images`;

  if (version > 1) {
    endpoint += `/${Id}/update`;
  }

  return instance.post(endpoint, payload);
};

export const getImageSet = ({
  id,
  q = {
    limit: 10,
    offset: 0,
    sort_by: '-created_at',
  },
}) => {
  const query = getTableParams(q);
  return instance.get(`${EDGE_API}/image-sets/${id}?${query}`);
};

export const getImageSetViewVersions = ({
  imageSetID,
  query = {
    limit: 20,
    offset: 0,
    sort_by: '-created_at',
  },
}) => {
  const q = getTableParams(query);
  return instance.get(
    `${EDGE_API}/image-sets/view/${imageSetID}/versions?${q}`
  );
};

export const getImageSetView = ({ id }) => {
  return instance.get(`${EDGE_API}/image-sets/view/${id}`);
};

export const getImagePackageMetadata = (id) => {
  try {
    return instance.get(`${EDGE_API}/images/${id}/metadata`);
  } catch (err) {
    console.log(err);
  }
};

export const fetchEdgeImages = (
  q = {
    limit: 20,
    offset: 0,
    sort_by: '-created_at',
  }
) => {
  const query = getTableParams(q);
  return instance.get(`${EDGE_API}/images?${query}`);
};

export const fetchEdgeImageSets = (
  q = {
    limit: 20,
    offset: 0,
    sort_by: '-created_at',
  }
) => {
  const query = getTableParams(q);
  return instance.get(`${EDGE_API}/image-sets?${query}`);
};

export const getEdgeImageStatus = (id) => {
  return instance.get(`${EDGE_API}/images/${id}/status`);
};

export const getImageDataOnDevice = (id) => {
  return instance.get(`${EDGE_API}/updates/device/${id}/image`);
};

export const getPackages = async (distribution, architecture, search) => {
  const params = new URLSearchParams({
    distribution,
    architecture,
    search,
  });
  return instance(`${IMAGE_BUILDER_API}/packages?${params.toString()}`);
};

export const getImageById = ({ id }) => {
  return instance.get(`${EDGE_API}/images/${id}/details`);
};

export const getImageSets = ({ query }) => {
  if (query === '') {
    query = { limit: 20, offset: 0, sort_by: '-updated_at' };
  }
  const q = getTableParams(query);
  return instance.get(`${EDGE_API}/image-sets/view?${q}`);
};
