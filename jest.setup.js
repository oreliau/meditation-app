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

// WidgetKit is only available in an iOS development build.
jest.mock("expo-widgets", () => ({
  addUserInteractionListener: () => ({ remove: jest.fn() }),
  createWidget: () => ({ updateSnapshot: jest.fn(), reload: jest.fn() }),
  createLiveActivity: () => ({
    start: () => ({ update: jest.fn(), end: jest.fn() }),
    getInstances: () => [],
  }),
}));
