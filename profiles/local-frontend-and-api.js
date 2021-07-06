/*global module*/

const SECTION = '';
const APP_ID = 'edge';
const FRONTEND_PORT = 8002;
const API_PORT = 3000;
const routes = {};

routes[`/beta/${SECTION ? `/${section}` : ''}${APP_ID}`] = {
  host: `http://localhost:${FRONTEND_PORT}`,
};
routes[`/${SECTION ? `/${section}` : ''}${APP_ID}`] = {
  host: `http://localhost:${FRONTEND_PORT}`,
};
routes[`/beta/apps/${APP_ID}`] = { host: `http://localhost:${FRONTEND_PORT}` };
routes[`/apps/${APP_ID}`] = { host: `http://localhost:${FRONTEND_PORT}` };

routes[`/api/${APP_ID}`] = { host: `http://localhost:${API_PORT}` };

routes['/config'] = { host: 'http://localhost:8889' }

module.exports = { routes };
