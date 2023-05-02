const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  sassPrefix: '.fleet-management, .edge',
});

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')(
    {
      root: resolve(__dirname, '../'),
      exposes: {
        // Application root
        './RootApp': resolve(__dirname, '../src/AppEntry'),
        // expose System detail to be used on insights
        './Inventory': resolve(__dirname, '../src/Routes/Devices/Inventory.js'),
        './DeviceTable': resolve(
          __dirname,
          '../src/Routes/Devices/DeviceTable.js'
        ),
        './UpdateDeviceModal': resolve(
          __dirname,
          '../src/Routes/Devices/DeviceTable.js'
        ),
        './AddDeviceModal': resolve(
          __dirname,
          '../src/Routes/Devices/AddDeviceModal.js'
        ),
        './CreateGroupModal': resolve(
          __dirname,
          '../src/Routes/Groups/CreateGroupModal.js'
        ),
      },
    }
  )
);

// plugins.push(new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)());

module.exports = {
  ...webpackConfig,
  plugins,
};
