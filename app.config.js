const appJson = require("./app.json");

const androidPackage = process.env.ANDROID_PACKAGE_NAME;
const androidVersionCode = process.env.ANDROID_VERSION_CODE;
const iosBundleIdentifier = process.env.IOS_BUNDLE_IDENTIFIER;

module.exports = {
  ...appJson,
  expo: {
    ...appJson.expo,
    android: {
      ...appJson.expo.android,
      ...(androidPackage ? { package: androidPackage } : {}),
      ...(androidVersionCode
        ? { versionCode: Number(androidVersionCode) }
        : {}),
    },
    ios: {
      ...appJson.expo.ios,
      ...(iosBundleIdentifier ? { bundleIdentifier: iosBundleIdentifier } : {}),
    },
  },
};
