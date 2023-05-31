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
        './Images': resolve(__dirname, '../src/Routes/ImageManager/Images.js'),
        './ImagesSetTable': resolve(
          __dirname,
          '../src/Routes/ImageManager/ImageSetsTable.js'
        ),
        './ImagesDetail': resolve(
          __dirname,
          '../src/Routes/ImageManagerDetail/ImageDetail.js'
        ),

        './DeviceTable': resolve(
          __dirname,
          '../src/Routes/Devices/DeviceTable.js'
        ),
        './UpdateDeviceModal': resolve(
          __dirname,
          '../src/Routes/Devices/UpdateDeviceModal.js'
        ),
        './UpdateSystem': resolve(
          __dirname,
          '../src/Routes/Devices/UpdateSystem.js'
        ),
      },
      shared: [
        { 'react-redux': { requiredVersion: deps['react-redux'] } },
        { 'react-dom': { singleton: true, eager: true } },
        { 'react-router-dom': { singleton: true, requiredVersion: '*' } },
        { 'react-redux': {} },
        { '@patternfly/react-core': { singleton: true } },
      ],
    }
  )
);

// plugins.push(new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)());

module.exports = {
  ...webpackConfig,
  plugins,
};
