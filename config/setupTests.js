global.fetch = require('jest-fetch-mock');
global.window = Object.create(window);

global.window.insights = {
  ...(window.insights || {}),
  chrome: {
    auth: {
      getUser: () => Promise.resolve({}),
    },
    registerModule: jest.fn(),
  },
};
