module.exports = (api) => {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Must run before the React Compiler plugin injected by babel-preset-expo.
      ["react-native-unistyles/plugin", { root: "src" }],
    ],
  };
};
