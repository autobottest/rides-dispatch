import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getPricingLimit } from "../src/config/pricingLimits";
import { isEnabled } from "../src/lib/flags";
import { logger } from "../src/lib/logger";
import { calculateFare } from "../src/pricing/fareCalculator";

vi.mock("../src/config/pricingLimits", () => ({ getPricingLimit: vi.fn() }));
vi.mock("../src/lib/flags", () => ({ isEnabled: vi.fn() }));

const shortTrip = {
  zoneId: "SF-MISSION",
  distanceKm: 0.5,
  durationMin: 1,
  surgeMultiplier: 1,
};

const shortSubtotal = 2.5 + 1.15 * 0.5 + 0.32;

describe("calculateFare", () => {
  beforeEach(() => {
    vi.mocked(isEnabled).mockReturnValue(true);
    vi.mocked(getPricingLimit).mockReturnValue(5);
    vi.spyOn(logger, "info").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it("raises a short trip to the configured floor and audits the override", () => {
    expect(calculateFare(shortTrip)).toBe(5);
    expect(isEnabled).toHaveBeenCalledWith("pricing_min_fare", { zoneId: shortTrip.zoneId });
    expect(getPricingLimit).toHaveBeenCalledWith("min_fare", { zoneId: shortTrip.zoneId });
    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith("pricing.override", {
      zoneId: shortTrip.zoneId,
      originalValue: shortSubtotal,
      appliedValue: 5,
    });
  });

  it("leaves a normal trip above the floor unchanged", () => {
    expect(calculateFare({ ...shortTrip, distanceKm: 10, durationMin: 20 })).toBeCloseTo(20.4);
    expect(logger.info).not.toHaveBeenCalled();
  });

  it("applies surge before the floor without multiplying the floor", () => {
    expect(calculateFare({ ...shortTrip, surgeMultiplier: 1.2 })).toBe(5);
    expect(logger.info).toHaveBeenCalledWith("pricing.override", expect.objectContaining({
      originalValue: shortSubtotal * 1.2,
      appliedValue: 5,
    }));
  });

  it("preserves a short trip that surge raises above the floor", () => {
    expect(calculateFare({ ...shortTrip, surgeMultiplier: 2 })).toBe(shortSubtotal * 2);
    expect(logger.info).not.toHaveBeenCalled();
  });

  it("does not audit a fare exactly at the floor", () => {
    expect(calculateFare({ ...shortTrip, distanceKm: 0, durationMin: 0, surgeMultiplier: 2 })).toBe(5);
    expect(logger.info).not.toHaveBeenCalled();
  });

  it("reads the configured floor on each calculation", () => {
    expect(calculateFare(shortTrip)).toBe(5);
    vi.mocked(getPricingLimit).mockReturnValue(8);
    expect(calculateFare(shortTrip)).toBe(8);
  });

  it("preserves legacy fares when the feature flag is disabled", () => {
    vi.mocked(isEnabled).mockReturnValue(false);
    expect(calculateFare(shortTrip)).toBe(shortSubtotal);
    expect(getPricingLimit).not.toHaveBeenCalled();
    expect(logger.info).not.toHaveBeenCalled();
  });

  it("supports existing callers without zone context", () => {
    const { zoneId, ...trip } = shortTrip;
    expect(calculateFare(trip)).toBe(5);
    expect(logger.info).toHaveBeenCalledWith("pricing.override", {
      zoneId: null,
      originalValue: shortSubtotal,
      appliedValue: 5,
    });
  });
});
