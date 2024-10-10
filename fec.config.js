/* global module, __dirname */
const { resolve } = require('path');
// const deps = require('./package.json').dependencies;

module.exports = {
  appUrl: '/edge',
  useProxy: true,
  proxyVerbose: true,
  moduleFederation: {
    exposes: {
      // Application root
      './RootApp': resolve(__dirname, './src/AppEntry'),
      // expose System detail to be used on insights
      './Inventory': resolve(__dirname, './src/Routes/Devices/Inventory.js'),
      './InventoryDetail': resolve(
        __dirname,
        './src/Routes/DeviceDetail/DeviceDetail.js'
      ),
      './Images': resolve(__dirname, './src/Routes/ImageManager/Images.js'),
      './ImagesSetTable': resolve(
        __dirname,
        './src/Routes/ImageManager/ImageSetsTable.js'
      ),
      './ImagesDetail': resolve(
        __dirname,
        './src/Routes/ImageManagerDetail/ImageDetail.js'
      ),
      './ImagesInformationCard': resolve(
        __dirname,
        './src/components/ImageInformationCard.js'
      ),
      './DeviceTable': resolve(
        __dirname,
        './src/Routes/Devices/DeviceTable.js'
      ),
      './DevicesView': resolve(
        __dirname,
        './src/Routes/Devices/DevicesView.js'
      ),
      './DevicesGroupDetail': resolve(
        __dirname,
        './src/Routes/Devices/DevicesGroupDetail.js'
      ),
      './Groups': resolve(__dirname, './src/Routes/Groups/Groups.js'),
      './GroupsDetails': resolve(
        __dirname,
        './src/Routes/GroupsDetail/GroupsDetail.js'
      ),
      './UpdateDeviceModal': resolve(
        __dirname,
        './src/Routes/Devices/UpdateDeviceModal.js'
      ),
      './UpdateImageModal': resolve(
        __dirname,
        './src/Routes/DeviceDetail/UpdateImageModal.js'
      ),
      './UpdateSystem': resolve(
        __dirname,
        './src/Routes/Devices/UpdateSystem.js'
      ),
    },
    // Doesn't work now due to a bug in fec https://github.com/RedHatInsights/frontend-components/pull/2076
    // shared: [
    //   { 'react-redux': { requiredVersion: deps['react-redux'] } },
    // ],
    exclude: ['react-router-dom'],
  },
};
