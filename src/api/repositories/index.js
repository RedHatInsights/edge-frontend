import { EDGE_API, getTableParams } from '../index';
import { instance } from '@redhat-cloud-services/frontend-components-utilities/interceptors/interceptors';

export const getCustomRepositories = ({ imageID = '', query }) => {
  const q = getTableParams(query);
  return instance.get(
    `${EDGE_API}/thirdpartyrepo?${imageID ? `imageID=${imageID}&` : ''}${q}`
  );
};

export const createCustomRepository = (payload) => {
  return instance.post(`${EDGE_API}/thirdpartyrepo`, {
    Name: payload.name,
    URL: payload.baseURL,
  });
};

export const editCustomRepository = (payload) => {
  return instance.put(`${EDGE_API}/thirdpartyrepo/${payload.id}`, {
    Name: payload.name,
    URL: payload.baseURL,
  });
};

export const removeCustomRepository = (id) =>
  instance.delete(`${EDGE_API}/thirdpartyrepo/${id}`);

export const validateRepoName = (name) => {
  return instance.get(`${EDGE_API}/thirdpartyrepo/checkName/${name}`);
};
