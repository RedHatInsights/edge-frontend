const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');

const insightsProxy = {
  https: false,
  ...(process.env.BETA && { deployment: 'beta/apps' }),
};

const webpackProxy = {
  deployment: process.env.BETA ? 'beta/apps' : 'apps',
  useProxy: true,
  env: `${process.env.ENVIRONMENT || 'stage'}-${
    process.env.BETA ? 'beta' : 'stable'
  }`, // for accessing prod-beta start your app with ENVIRONMENT=prod and BETA=true
  appUrl: process.env.BETA ? ['/preview/edge', '/beta/edge'] : '/edge',
  ...(process.env.INSIGHTS_CHROME && {
    localChrome: process.env.INSIGHTS_CHROME,
  }),
  routes: {
    ...(process.env.API_PORT && {
      '/api/edge': { host: `http://localhost:${process.env.API_PORT}` },
    }),
    ...(process.env.CONFIG_PORT && {
      [`${process.env.BETA ? '/beta' : ''}/config`]: {
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
        //   '../src/Routes/Devices/UpdateDeviceModal.js'
        // ),
        // './AddDeviceModal': resolve(
        //   __dirname,
        //   '../src/Routes/Devices/AddDeviceModal.js'
        // ),
        // './CreateGroupModal': resolve(
        //   __dirname,
        //   '../src/Routes/Groups/CreateGroupModal.js'
        // ),
        // './RemoveDeviceModal': resolve(
        //   __dirname,
        //   '../src/Routes/Devices/RemoveDeviceModal.js'
        // ),
      },
    }
  )
);

webpackConfig.devServer.client.overlay = false;

module.exports = {
  ...webpackConfig,
  plugins,
};
