module.exports = {
  preset: "jest-expo",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.js",
    "react-native-unistyles/mocks",
  ],
  resolver: "react-native-worklets/jest/resolver",
  testMatch: [
    "**/__tests__/**/*.test.{js,ts,tsx}",
    "**/*.{spec,test}.{js,ts,tsx}",
  ],
  // Mirrors tsconfig.json `paths`; order matters (assets before the catch-all).
  moduleNameMapper: {
    "^@formatjs/.*/polyfill\\.js$": "<rootDir>/src/test/intl-polyfill.mock.js",
    "^@/assets/(.*)$": "<rootDir>/assets/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "!app/**/*.d.ts",
    "!app/**/index.{ts,tsx}",
  ],
};
