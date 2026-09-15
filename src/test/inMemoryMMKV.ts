// In-memory stand-in for `createMMKV`, installed globally by jest.setup.js
// (which wraps each method in `jest.fn`) so storage seams can be tested for
// real round-trips. One store per call, like the native module; tests
// isolate with `<instance>.clearAll()`.
export function createInMemoryMMKV() {
  const store = new Map<string, string | number | boolean>();
  const listeners = new Set<(key: string) => void>();
  const notify = (key: string) => {
    for (const listener of listeners) {
      listener(key);
    }
  };

  return {
    getString: (key: string) => {
      const v = store.get(key);
      return typeof v === "string" ? v : undefined;
    },
    getNumber: (key: string) => {
      const v = store.get(key);
      return typeof v === "number" ? v : undefined;
    },
    getBoolean: (key: string) => {
      const v = store.get(key);
      return typeof v === "boolean" ? v : undefined;
    },
    set: (key: string, value: string | number | boolean) => {
      store.set(key, value);
      notify(key);
    },
    remove: (key: string) => {
      const existed = store.delete(key);
      if (existed) {
        notify(key);
      }
      return existed;
    },
    contains: (key: string) => store.has(key),
    getAllKeys: () => [...store.keys()],
    clearAll: () => store.clear(),
    // Test-only stand-in for react-native-mmkv's change-listener API, wired
    // up by the `useMMKVListener` mock in jest.setup.js.
    _subscribe: (listener: (key: string) => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
