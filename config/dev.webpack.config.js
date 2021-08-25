const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');

const insightsProxy = {
  https: false,
  ...(process.env.BETA && { deployment: 'beta/apps' }),
};

const webpackProxy = {
  deployment: process.env.BETA ? 'beta/apps' : 'apps',
  useProxy: true,
  env: 'stage-beta', // for accessing prod-beta change this to 'prod-beta'
  appUrl: process.env.BETA ? '/beta/edge' : '/edge',
  ...(process.env.API_PORT && {
    routes: {
      '/api/edge': { host: `http://localhost:${process.env.API_PORT}` },
    },
  }),
};

const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  useFileHash: false,
  sassPrefix: '.fleet-management, .edge',
  ...(process.env.PROXY ? webpackProxy : insightsProxy),
});

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')(
    {
      root: resolve(__dirname, '../'),
    }
  )
);

module.exports = {
  ...webpackConfig,
  plugins,
};
