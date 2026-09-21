import {
  getExperienceLevel,
  getHasCompletedOnboarding,
  getIntentions,
  getSoundscape,
  onboardingStorage,
  setExperienceLevel,
  setHasCompletedOnboarding,
  setIntentions,
  setSoundscape,
} from "./storage";

beforeEach(() => {
  onboardingStorage.clearAll();
});

describe("hasCompletedOnboarding", () => {
  it("is false until onboarding is completed", () => {
    expect(getHasCompletedOnboarding()).toBe(false);

    setHasCompletedOnboarding();

    expect(getHasCompletedOnboarding()).toBe(true);
  });
});

describe("intentions", () => {
  it("is empty until intentions are chosen, and round-trips a selection", () => {
    expect(getIntentions()).toEqual([]);

    setIntentions(["sleep", "focus-clarity"]);

    expect(getIntentions()).toEqual(["sleep", "focus-clarity"]);
  });

  it("ignores unknown ids from a corrupted or future-versioned value", () => {
    onboardingStorage.set(
      "intentions",
      JSON.stringify(["sleep", "not-a-real-intention"]),
    );

    expect(getIntentions()).toEqual(["sleep"]);
  });

  it("falls back to empty for malformed JSON", () => {
    onboardingStorage.set("intentions", "{not json");

    expect(getIntentions()).toEqual([]);
  });
});

describe("experienceLevel", () => {
  it("is undefined until chosen, and round-trips a selection", () => {
    expect(getExperienceLevel()).toBeUndefined();

    setExperienceLevel("guide");

    expect(getExperienceLevel()).toBe("guide");
  });

  it("ignores an unknown stored value", () => {
    onboardingStorage.set("experienceLevel", "not-a-real-level");

    expect(getExperienceLevel()).toBeUndefined();
  });
});

describe("soundscape", () => {
  it("is undefined until chosen, and round-trips a selection", () => {
    expect(getSoundscape()).toBeUndefined();

    setSoundscape("silent-river");

    expect(getSoundscape()).toBe("silent-river");
  });

  it("ignores an unknown stored value", () => {
    onboardingStorage.set("soundscape", "not-a-real-soundscape");

    expect(getSoundscape()).toBeUndefined();
  });
});
