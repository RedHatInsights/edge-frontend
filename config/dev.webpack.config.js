const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  https: false,
  useFileHash: false,
  sassPrefix: '.fleet-management',
  ...(process.env.PROXY && {
    https: true,
    useProxy: true,
    proxyVerbose: true,
    appUrl: process.env.BETA ? '/beta/edge' : '/edge',
  }),
});

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')(
    {
      root: resolve(__dirname, '../'),
      useFileHash: false,
    }
  )
);

module.exports = {
  ...webpackConfig,
  plugins,
};
