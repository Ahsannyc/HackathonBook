// GitHub MCP plugin for Docusaurus
const path = require('path');

module.exports = function (context, options) {
  const { siteDir } = context;
  const { enabled = true, repoOwner = 'Ahsannyc', repoName = 'HackathonBook', accessToken = process.env.GITHUB_PERSONAL_ACCESS_TOKEN } = options || {};

  if (!enabled) {
    return {
      name: 'github-plugin',
      async loadContent() {
        // Plugin disabled, return early
        return;
      },
    };
  }

  return {
    name: 'github-plugin',

    async loadContent() {
      // This function runs during the build process
      // You can fetch data from the GitHub repository here
      console.log('GitHub connector plugin loaded');
      console.log(`Repository: ${repoOwner}/${repoName}`);

      // In a real implementation, you would connect to the GitHub API here
      // and fetch repository data, issues, pull requests, etc.
    },

    configureWebpack(config, isServer, utils) {
      // Configure webpack to handle any specific requirements for the GitHub connection
      return {
        // Add any webpack configuration needed for the plugin
      };
    },

    getThemePath() {
      // Return the path to the theme components if needed
      // Only return path if the directory exists to avoid build errors
      const themePath = path.resolve(__dirname, './src/plugins/github-theme');
      // Check if theme directory exists before returning
      try {
        require('fs').accessSync(themePath);
        return themePath;
      } catch (e) {
        // If theme directory doesn't exist, don't return a theme path
        return null;
      }
    },

    getClientModules() {
      // Return any client modules that need to be loaded
      // This is where we can add client-side code to interact with GitHub
      // Only include modules that exist to avoid build errors
      const modules = [];
      try {
        const clientModulePath = path.resolve(__dirname, './src/plugins/github-client-module');
        // Check if the client module exists before adding it
        require('fs').accessSync(clientModulePath);
        modules.push(clientModulePath);
      } catch (e) {
        // If client module doesn't exist, don't include it
        console.log('GitHub client module not found, skipping...');
      }
      return modules;
    },
  };
};