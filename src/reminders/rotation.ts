// Which sentence a reminder carries is a pure function of the *delivery
// day*: consecutive days walk through the set in order, so two consecutive
// mornings can never read the same — however many times the app is
// foregrounded (and the content re-issued) in between. Randomness lives
// only in a per-install offset, so different users start at different
// points.

const DAY_MS = 86_400_000;

// Local calendar day of the next hour:minute delivery, as a day number
// (consecutive local days differ by exactly one, across DST and year ends).
export function nextDeliveryDayNumber(
  now: Date,
  hour: number,
  minute: number,
): number {
  const todayNumber = Math.floor(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / DAY_MS,
  );
  const deliveredAlready =
    now.getHours() > hour ||
    (now.getHours() === hour && now.getMinutes() >= minute);
  return deliveredAlready ? todayNumber + 1 : todayNumber;
}

export function sentenceIndexForDay(
  dayNumber: number,
  count: number,
  offset: number,
): number {
  if (count <= 1) {
    return 0;
  }
  return (((dayNumber + offset) % count) + count) % count;
}
