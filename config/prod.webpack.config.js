const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  sassPrefix: '.fleet-management, .edge',
});
const deps = require('../package.json').dependencies;
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
        // './UpdateDeviceModal': resolve(
        //   __dirname,
        //   '../src/Routes/Devices/DeviceTable.js'
        // ),
        // './AddDeviceModal': resolve(
        //   __dirname,
        //   '../src/Routes/Devices/AddDeviceModal.js'
        // ),
        // './CreateGroupModal': resolve(
        //   __dirname,
        //   '../src/Routes/Groups/CreateGroupModal.js'
        // ),
      },
      shared: [
        { 'react-redux': { requiredVersion: deps['react-redux'] } },
        {
          'react-router-dom': {
            singleton: true,
            requiredVersion: deps['react-router-dom'],
          },
        },
        {
          react: { singleton: true, eager: true, requiredVersion: deps.react },
        },
        {
          'react-dom': {
            singleton: true,
            eager: true,
            requiredVersion: deps['react-dom'],
          },
        },
      ],
    }
  )
);

// plugins.push(new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)());

module.exports = {
  ...webpackConfig,
  plugins,
};
