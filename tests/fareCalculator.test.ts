import { describe, expect, it } from "vitest";
import { calculateFare, BASE_FARE, PER_KM, PER_MIN } from "../src/pricing/fareCalculator";

describe("calculateFare minimum fare (RIDE-21)", () => {
  it("charges the minimum fare for a short trip below the floor", () => {
    expect(calculateFare({ distanceKm: 0.5, durationMin: 2, surgeMultiplier: 1 })).toBe(5);
  });

  it("charges the normal fare for a trip above the floor", () => {
    const input = { distanceKm: 10, durationMin: 20, surgeMultiplier: 1 };
    const expected = BASE_FARE + PER_KM * input.distanceKm + PER_MIN * input.durationMin;
    expect(calculateFare(input)).toBeCloseTo(expected, 2);
  });
});
