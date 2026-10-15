import {
  DEFAULT_TIME_CONFIG,
  formatTimeForDisplay,
  generateTimeSlots,
  mealTypeToTime,
  parseTime,
} from "./timeSlots";

describe("time slot helpers", () => {
  it("generates the default hourly calendar slots inclusively", () => {
    const slots = generateTimeSlots();

    expect(slots).toHaveLength(18);
    expect(slots[0]).toBe("06:00");
    expect(slots.at(-1)).toBe("23:00");
    expect(generateTimeSlots(DEFAULT_TIME_CONFIG)).toEqual(slots);
  });

  it("preserves custom slot intervals", () => {
    expect(
      generateTimeSlots({ startHour: 8, endHour: 9, intervalMinutes: 60 }),
    ).toEqual(["08:00", "09:00"]);
  });

  it("returns no slots for a reversed hour range", () => {
    expect(
      generateTimeSlots({ startHour: 9, endHour: 8, intervalMinutes: 60 }),
    ).toEqual([]);
  });

  it.each([
    ["00:00", "12 AM"],
    ["08:00", "8 AM"],
    ["12:00", "12 PM"],
    ["18:05", "6:05 PM"],
    ["23:30", "11:30 PM"],
  ])("formats %s as %s", (time, expected) => {
    expect(formatTimeForDisplay(time)).toBe(expected);
  });

  it("parses hours and minutes without changing their values", () => {
    expect(parseTime("08:05")).toEqual({ hour: 8, minute: 5 });
    expect(parseTime("23:59")).toEqual({ hour: 23, minute: 59 });
  });

  it.each([
    ["breakfast", "08:00"],
    ["LUNCH", "12:30"],
    ["dinner", "18:30"],
    ["snack", "15:00"],
    ["unknown", "12:00"],
  ])("preserves the legacy mapping for %s", (mealType, expected) => {
    expect(mealTypeToTime(mealType)).toBe(expected);
  });
});
