import { describe, expect, it } from "vitest";
import { calculateFare } from "../src/pricing/fareCalculator";

describe("calculateFare", () => {
  it("computes a fare for valid input", () => {
    expect(calculateFare({ distanceKm: 10, durationMin: 20, surgeMultiplier: 1 })).toBeCloseTo(20.4);
  });

  it("rejects negative distance", () => {
    expect(() => calculateFare({ distanceKm: -1, durationMin: 5, surgeMultiplier: 1 })).toThrow(RangeError);
  });

  it("rejects a surge multiplier below 1", () => {
    expect(() => calculateFare({ distanceKm: 3, durationMin: 5, surgeMultiplier: 0.5 })).toThrow(RangeError);
  });
});
