/*global module*/

const SECTION = '';
const APP_ID = 'edge';
const FRONTEND_PORT = 8002;
const routes = {};

routes[`/preview/${SECTION ? `/${section}` : ''}${APP_ID}`] = {
  host: `http://localhost:${FRONTEND_PORT}`,
};
routes[`/${SECTION ? `/${section}` : ''}${APP_ID}`] = {
  host: `http://localhost:${FRONTEND_PORT}`,
};
routes[`/preview/apps/${APP_ID}`] = { host: `http://localhost:${FRONTEND_PORT}` };
routes[`/apps/${APP_ID}`] = { host: `http://localhost:${FRONTEND_PORT}` };

module.exports = { routes };
