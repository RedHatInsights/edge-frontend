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
    async setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config)
      const file = config.env.configFile || "local";
      await getConfigurationByFile(file).then(configFile =>{
        config.env = {...configFile.env, ...config.env}
        config.baseUrl = configFile.baseUrl
      })
      return config;
    },
  },
  env: {
    codeCoverage: {
      exclude: ['cypress/**/*.*']
    }
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
  },
});
