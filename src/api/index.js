export const IMAGE_BUILDER_API = '/api/image-builder/v1';
export const EDGE_API = '/api/edge/v1';
export const CONTENT_SOURCES_API = '/api/content-sources/v1';
export const INVENTORY_API_BASE = '/api/inventory/v1';

import instance from '@redhat-cloud-services/frontend-components-utilities/interceptors';
import { HostsApi } from '@redhat-cloud-services/host-inventory-client';

export { instance };
export const hosts = new HostsApi(undefined, INVENTORY_API_BASE, instance);

export const getTableParams = (q) => {
  if (q === undefined) {
    return '';
  }
  const query = Object.keys(q).reduce((acc, curr) => {
    let value = undefined;
    if (
      typeof q[curr] === 'object' &&
      typeof q[curr].length === 'number' &&
      q[curr].length > 0
    ) {
      value = q[curr].reduce(
        (multiVals, val) =>
          multiVals === '' ? `${curr}=${val}` : `${multiVals}&${curr}=${val}`,
        ''
      );
    }
    if (['string', 'number'].includes(typeof q[curr]) && q[curr] !== '') {
      value = `${curr}=${q[curr]}`;
    }
    return value === undefined
      ? acc
      : acc === ''
      ? `${value}`
      : `${acc}&${value}`;
  }, '');

  return query;
};
