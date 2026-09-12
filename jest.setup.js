// Mock native modules that don't exist in test environment
jest.mock("react-native-mmkv", () => ({
  createMMKV: jest.fn(() => ({
    getString: jest.fn(),
    getNumber: jest.fn(),
    setString: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
  })),
}));
