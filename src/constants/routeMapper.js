export const routes = {
  groups: '/groups',
  'groups-detail': '/groups/:uuid',
  'device-detail': '/groups/:uuid/:inventoryId',
  canaries: '/canaries',
  'fleet-management': '/fleet-management',
  'fleet-management-detail': '/fleet-management/:groupId',
  'fleet-management-system-detail':
    '/fleet-management/:groupId/systems/:deviceId',
  inventory: '/inventory',
  'inventory-detail': '/inventory/:deviceId',
  'manage-images': '/manage-images',
  'manage-images-detail': '/manage-images/:imageId',
  'manage-images-detail-version':
    '/manage-images/:imageId/versions/:imageVersionId',
  repositories: '/repositories',
  'learning-resources': '/learning-resources',
};
