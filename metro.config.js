const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Archive/CI builds saturate CPU with native compilation right before this
// runs; too many parallel transform workers can starve and crash mid-bundle
// with "Cannot read properties of undefined (reading 'transformFile')".
config.maxWorkers = 1;

module.exports = config;
