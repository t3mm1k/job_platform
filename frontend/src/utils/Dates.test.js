import { calculateDays, getDayWord } from "./Dates";

describe("getDayWord", () => {
  it.each([
    [1, "день"],
    [2, "дня"],
    [4, "дня"],
    [5, "дней"],
    [11, "дней"],
    [21, "день"],
    [22, "дня"],
    [100, "дней"]
  ])("getDayWord(%i) -> %s", (n, expected) => {
    expect(getDayWord(n)).toBe(expected);
  });
});

describe("calculateDays", () => {
  const fixedNow = new Date("2024-06-15T12:00:00.000Z");

  it("computes past and remaining from unix seconds", () => {
    const pastUnix = new Date("2024-06-02T12:00:00.000Z").getTime() / 1000;
    const r = calculateDays(pastUnix, 31, fixedNow);
    expect(r.past.days).toBe(13);
    expect(r.remaining.days).toBe(18);
    expect(r.past.daysWord).toBe("дней");
  });
});
