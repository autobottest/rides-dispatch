import { beforeAll, describe, expect, it } from "vitest";

beforeAll(() => {
  process.env.ENABLED_FLAGS = "airport_surge_cap";
});

const load = () => import("../src/pricing/surge");
const base = { zoneId: "SF-MISSION", riderId: "r_123" };

describe("surgeMultiplier", () => {
  it("is 1.0 when supply meets demand", async () => {
    const { surgeMultiplier } = await load();
    expect(surgeMultiplier({ ...base, demand: 10, supply: 10 })).toBe(1);
  });

  it("rises with demand", async () => {
    const { surgeMultiplier } = await load();
    expect(surgeMultiplier({ ...base, demand: 30, supply: 10 })).toBe(2);
  });

  it("is capped at MAX_MULTIPLIER", async () => {
    const { surgeMultiplier, MAX_MULTIPLIER } = await load();
    expect(surgeMultiplier({ ...base, demand: 500, supply: 1 })).toBe(MAX_MULTIPLIER);
  });

  it("caps airport pickups at 2.0x (RIDE-1)", async () => {
    const { surgeMultiplier, AIRPORT_SURGE_CAP } = await load();
    expect(
      surgeMultiplier({ zoneId: "SFO-T2", riderId: "r_9", demand: 500, supply: 1 }),
    ).toBe(AIRPORT_SURGE_CAP);
  });
});
