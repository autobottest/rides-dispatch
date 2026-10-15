import { describe, expect, it } from "vitest";
import { surgeMultiplier, MAX_MULTIPLIER } from "../src/pricing/surge";

const base = { zoneId: "SF-MISSION", riderId: "r_123" };

describe("surgeMultiplier", () => {
  it("is 1.0 when supply meets demand", () => {
    expect(surgeMultiplier({ ...base, demand: 10, supply: 10 })).toBe(1);
  });

  it("rises with demand", () => {
    expect(surgeMultiplier({ ...base, demand: 30, supply: 10 })).toBe(2);
  });

  it("is capped at MAX_MULTIPLIER", () => {
    expect(surgeMultiplier({ ...base, demand: 500, supply: 1 })).toBe(MAX_MULTIPLIER);
  });
});
