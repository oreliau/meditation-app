const { app: notificationsApp } = require("./src/reminders/app.ts");
const { app: fontsApp } = require("./src/theme/app.ts");

const androidPackage =
  process.env.ANDROID_PACKAGE_NAME || "com.oreliaukmz.meditationapp";
const androidVersionCode = process.env.ANDROID_VERSION_CODE || 1;
const iosBundleIdentifier =
  process.env.IOS_BUNDLE_IDENTIFIER || "com.oreliaukmz.meditationapp";

export default {
  expo: {
    name: "meditation-app",
    slug: "meditation-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "meditationapp",
    userInterfaceStyle: "automatic",
    ios: {
      icon: "./assets/meditation-app.icon",
      deploymentTarget: "17.0",
      bundleIdentifier: iosBundleIdentifier,
      supportsTablet: true,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      predictiveBackGestureEnabled: false,
      package: androidPackage,
      versionCode: Number(androidVersionCode),
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#fbf9f5",
          image: "./assets/images/splash-icon.png",
          imageWidth: 76,
        },
      ],
      ...(fontsApp.plugins ?? []),
      "expo-image",
      "expo-audio",
      "expo-asset",
      "expo-status-bar",
      "expo-localization",
      ...(notificationsApp.plugins ?? []),
      [
        "expo-build-properties",
        {
          android: {
            minSdkVersion: 26,
          },
        },
      ],
      "react-native-webgpu",

      [
        "expo-font",
        {
          fonts: [
            "node_modules/@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf",
            "node_modules/@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf",
            "node_modules/@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf",
            "node_modules/@expo-google-fonts/playfair-display/500Medium/PlayfairDisplay_500Medium.ttf",
            "node_modules/@expo-google-fonts/playfair-display/600SemiBold/PlayfairDisplay_600SemiBold.ttf",
          ],
        },
      ],
      "expo-web-browser",
      "expo-widgets",
    ],
    experiments: {
      reactCompiler: true,
      typedRoutes: true,
      baseUrl: "/meditation-app",
    },
    extra: {
      eas: {
        projectId: "a80aea2a-9ef2-43ce-9067-f90ea61e6a11",
      },
    },
  },
};
