module.exports = {
  preset: "jest-expo",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testMatch: [
    "**/__tests__/**/*.test.{js,ts,tsx}",
    "**/*.{spec,test}.{js,ts,tsx}",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "!app/**/*.d.ts",
    "!app/**/index.{ts,tsx}",
  ],
};
