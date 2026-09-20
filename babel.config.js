module.exports = (api) => {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Must run before the React Compiler plugin injected by babel-preset-expo.
      ["react-native-unistyles/plugin", { root: "apps/mobile/src" }],
      // Excludes jest.setup.js and test files: the plugin wraps every arrow/function
      // with a `globalThis.__TYPEGPU_AUTONAME__` reference, which breaks jest.mock()'s
      // out-of-scope-variable check when applied to test setup/spec files.
      [
        "unplugin-typegpu/babel",
        {
          exclude: [/jest\.setup\.js$/, /__tests__/, /\.(test|spec)\.[jt]sx?$/],
        },
      ],
    ],
  };
};
