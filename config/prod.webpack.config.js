const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  sassPrefix: '.fleet-management',
});

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')(
    {
      root: resolve(__dirname, '../'),
    }
  )
);

// plugins.push(new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)());

module.exports = {
  ...webpackConfig,
  plugins,
};
