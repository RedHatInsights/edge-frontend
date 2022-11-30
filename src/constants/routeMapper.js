export const routes = {
  groups: '/groups',
  'groups-detail': '/groups/:uuid',
  'device-detail': '/groups/:uuid/:inventoryId',
  canaries: '/canaries',
  'fleet-management': '/fleet-management',
  'fleet-management-detail': '/fleet-management/:groupId',
  inventory: '/inventory',
  'inventory-detail': '/inventory/:deviceId',
  'inventory-detail-update': '/inventory/:deviceId/update',
  'manage-images': '/manage-images',
  'manage-images-detail': '/manage-images/:imageId',
  'manage-images-detail-version':
    '/manage-images/:imageId/versions/:imageVersionId',
  repositories: '/repositories',
  'learning-resources': '/learning-resources',
};
