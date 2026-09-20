const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
config.maxWorkers = 1;
config.watchFolders = [
  require("node:path").resolve(__dirname, "../../packages"),
];
module.exports = config;
