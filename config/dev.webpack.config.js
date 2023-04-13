const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');

const insightsProxy = {
  https: false,
  ...(process.env.BETA && { deployment: 'preview/apps' }),
};

const webpackProxy = {
  deployment: process.env.BETA ? 'preview/apps' : 'apps',
  useProxy: true,
  env: `${process.env.ENVIRONMENT || 'stage'}-${
    process.env.BETA ? 'preview' : 'stable'
  }`, // for accessing prod-beta start your app with ENVIRONMENT=prod and BETA=true
  appUrl: process.env.BETA ? '/preview/edge' : '/edge',
  ...(process.env.INSIGHTS_CHROME && {
    localChrome: process.env.INSIGHTS_CHROME,
  }),
  routes: {
    ...(process.env.API_PORT && {
      '/api/edge': { host: `http://localhost:${process.env.API_PORT}` },
    }),
    ...(process.env.CONFIG_PORT && {
      [`${process.env.BETA ? '/preview' : ''}/config`]: {
        host: `http://localhost:${process.env.CONFIG_PORT}`,
      },
    }),
  },
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
      './Inventory': resolve(__dirname, '../src/Routes/Devices/Inventory.js'),
    }
  )
);

webpackConfig.devServer.client.overlay = false;

module.exports = {
  ...webpackConfig,
  plugins,
};
