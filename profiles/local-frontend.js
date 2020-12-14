/*global module*/

const SECTION = '';
const APP_ID = 'edge';
const FRONTEND_PORT = 8002;
const routes = {};

routes[`/beta/${SECTION ? `/${section}` : ''}${APP_ID}`] = { host: `https://localhost:${FRONTEND_PORT}` };
routes[`/${SECTION ? `/${section}` : ''}${APP_ID}`]      = { host: `https://localhost:${FRONTEND_PORT}` };
routes[`/beta/apps/${APP_ID}`]       = { host: `https://localhost:${FRONTEND_PORT}` };
routes[`/apps/${APP_ID}`]            = { host: `https://localhost:${FRONTEND_PORT}` };

module.exports = { routes };
