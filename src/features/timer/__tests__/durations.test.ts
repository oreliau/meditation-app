import { formatDurationLabel } from "../durations";

describe("formatDurationLabel", () => {
  it("formats sub-minute durations as seconds", () => {
    expect(formatDurationLabel(0.1)).toBe("6 secs");
    expect(formatDurationLabel(0.5)).toBe("30 secs");
  });

  it("pluralizes minute labels naturally", () => {
    expect(formatDurationLabel(1)).toBe("1 min");
    expect(formatDurationLabel(3)).toBe("3 mins");
  });

  it("formats hour durations with spaced combined units", () => {
    expect(formatDurationLabel(60)).toBe("1 hr");
    expect(formatDurationLabel(90)).toBe("1 hr 30 mins");
    expect(formatDurationLabel(120)).toBe("2 hrs");
  });
});
