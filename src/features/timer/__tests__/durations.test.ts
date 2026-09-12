import {
  DEFAULT_DURATION_MINUTES,
  DURATION_PRESETS_MINUTES,
  formatClock,
  formatDurationLabel,
} from "../durations";

describe("formatDurationLabel", () => {
  it("labels sub-hour presets as '{n} min'", () => {
    expect(formatDurationLabel(3)).toBe("3 min");
    expect(formatDurationLabel(12)).toBe("12 min");
    expect(formatDurationLabel(45)).toBe("45 min");
  });

  it("labels whole hours as '{h}h'", () => {
    expect(formatDurationLabel(60)).toBe("1h");
    expect(formatDurationLabel(120)).toBe("2h");
  });

  it("labels hour-and-a-half as '1h30'", () => {
    expect(formatDurationLabel(90)).toBe("1h30");
  });
});

describe("duration presets", () => {
  it("offers the fixed preset list, with 12 min as the default", () => {
    expect(DURATION_PRESETS_MINUTES).toEqual([
      3, 5, 10, 12, 15, 20, 30, 45, 60, 90, 120,
    ]);
    expect(DEFAULT_DURATION_MINUTES).toBe(12);
  });
});

describe("formatClock", () => {
  it("renders whole minutes as mm:ss, matching the mockups' 12:00", () => {
    expect(formatClock(12 * 60)).toBe("12:00");
  });

  it("zero-pads seconds and single-digit minutes", () => {
    expect(formatClock(65)).toBe("1:05");
    expect(formatClock(0)).toBe("0:00");
  });

  it("switches to h:mm:ss at an hour and above", () => {
    expect(formatClock(60 * 60)).toBe("1:00:00");
    expect(formatClock(90 * 60 + 7)).toBe("1:30:07");
  });
});
