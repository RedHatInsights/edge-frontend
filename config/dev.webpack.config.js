const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  https: false,
  useFileHash: false,
  sassPrefix: '.fleet-management, .edge',
  ...(process.env.PROXY && {
    https: true,
    useProxy: true,
    proxyVerbose: true,
    appUrl: process.env.BETA ? '/beta/edge' : '/edge',
  }),
  ...(process.env.BETA ? { deployment: 'beta/apps' } : {}),
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
