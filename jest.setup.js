// Mock native modules that don't exist in test environment.
//
// MMKV: one in-memory store per `createMMKV` call (like the native module),
// with every method wrapped in `jest.fn` around the real implementation.
// Storage seams can therefore be tested for real round-trips (isolate with
// `<instance>.clearAll()` in `beforeEach`), and tests that prefer scripting
// (`mockReturnValue`, `mockReset`) still can — a reset only affects that
// instance.
jest.mock("react-native-mmkv", () => ({
  createMMKV: () => {
    const store = jest
      .requireActual("./src/test/inMemoryMMKV")
      .createInMemoryMMKV();
    for (const key of Object.keys(store)) {
      store[key] = jest.fn(store[key]);
    }
    return store;
  },
}));
