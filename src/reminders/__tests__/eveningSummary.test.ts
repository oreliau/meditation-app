import { composeEveningSummary } from "../eveningSummary";

describe("composeEveningSummary", () => {
  it("reflects the day's activity back, personalised with minutes and sessions", () => {
    const { title, body } = composeEveningSummary({
      sessionCount: 2,
      totalDurationSeconds: 720,
    });
    expect(title).toBe("Evening summary");
    expect(body).toBe(
      "You showed up for yourself today — 12 minutes, 2 sessions. Let that settle in.",
    );
  });

  it("uses singular forms for a single short session", () => {
    const { body } = composeEveningSummary({
      sessionCount: 1,
      totalDurationSeconds: 60,
    });
    expect(body).toContain("1 minute, 1 session");
  });

  it("rounds durations to whole minutes", () => {
    const { body } = composeEveningSummary({
      sessionCount: 1,
      totalDurationSeconds: 190,
    });
    expect(body).toContain("3 minutes, 1 session");
  });

  it("offers a gentle nudge, never silence, when there was no activity", () => {
    const { title, body } = composeEveningSummary({
      sessionCount: 0,
      totalDurationSeconds: 0,
    });
    expect(title).toBe("Evening summary");
    expect(body).toBe(
      "The day isn't over yet. A few quiet breaths before bed still count.",
    );
  });
});
