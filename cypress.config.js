const { defineConfig } = require("cypress");

// eslint-disable-next-line no-unused-vars
const fs = require("fs-extra");
const path = require("path");

function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve("cypress/config", `${file}.env.json`);
  // check if file exists
  if (!fs.existsSync(pathToConfigFile)) {
    throw new Error(`Config file ${pathToConfigFile} does not exist`);
  }

  return fs.readJson(pathToConfigFile);
}

module.exports = defineConfig({
  chromeWebSecurity: false,

  e2e: {
    setupNodeEvents(on, config) {
      // accept a configFile value or use local by default
      const file = config.env.configFile || "local";
      return getConfigurationByFile(file);
    },
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
  },
});
