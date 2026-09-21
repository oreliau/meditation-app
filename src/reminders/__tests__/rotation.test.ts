import { PRESENCE_SENTENCES } from "../presenceSentences";
import { nextDeliveryDayNumber, sentenceIndexForDay } from "../rotation";

describe("presence sentences", () => {
  it("bundles a curated set of roughly 20–30 distinct sentences", () => {
    expect(PRESENCE_SENTENCES.length).toBeGreaterThanOrEqual(20);
    expect(PRESENCE_SENTENCES.length).toBeLessThanOrEqual(30);
    expect(new Set(PRESENCE_SENTENCES).size).toBe(PRESENCE_SENTENCES.length);
  });
});

describe("nextDeliveryDayNumber", () => {
  const today = nextDeliveryDayNumber(new Date(2026, 8, 12, 0, 0), 8, 0);

  it("is today while the delivery time is still ahead", () => {
    expect(nextDeliveryDayNumber(new Date(2026, 8, 12, 7, 59), 8, 0)).toBe(
      today,
    );
  });

  it("is tomorrow once today's delivery time has passed", () => {
    expect(nextDeliveryDayNumber(new Date(2026, 8, 12, 8, 0), 8, 0)).toBe(
      today + 1,
    );
    expect(nextDeliveryDayNumber(new Date(2026, 8, 12, 23, 59), 8, 0)).toBe(
      today + 1,
    );
  });

  it("counts local calendar days, so consecutive days differ by exactly one", () => {
    expect(nextDeliveryDayNumber(new Date(2026, 8, 13, 7, 0), 8, 0)).toBe(
      today + 1,
    );
    expect(nextDeliveryDayNumber(new Date(2026, 11, 31, 7, 0), 8, 0) + 1).toBe(
      nextDeliveryDayNumber(new Date(2027, 0, 1, 7, 0), 8, 0),
    );
  });
});

describe("sentenceIndexForDay", () => {
  it("never gives two consecutive days the same sentence", () => {
    for (let day = 0; day < 100; day++) {
      expect(sentenceIndexForDay(day + 1, 24, 7)).not.toBe(
        sentenceIndexForDay(day, 24, 7),
      );
    }
  });

  it("walks through every sentence before repeating", () => {
    const seen = new Set<number>();
    for (let day = 0; day < 24; day++) {
      seen.add(sentenceIndexForDay(day, 24, 5));
    }
    expect(seen.size).toBe(24);
  });

  it("always stays within the set, whatever the offset", () => {
    for (const offset of [0, 3, 23, 24, 1000]) {
      const index = sentenceIndexForDay(20_000, 24, offset);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(24);
    }
  });

  it("is stable for the same day, so refreshing twice changes nothing", () => {
    expect(sentenceIndexForDay(42, 24, 9)).toBe(sentenceIndexForDay(42, 24, 9));
  });
});
