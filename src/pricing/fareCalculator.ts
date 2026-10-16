import { getPricingLimit } from "../config/pricingLimits";
import { isEnabled } from "../lib/flags";
import { logger } from "../lib/logger";

export interface FareInput {
  zoneId?: string;
  distanceKm: number;
  durationMin: number;
  surgeMultiplier: number;
}

export const BASE_FARE = 2.5;
export const PER_KM = 1.15;
export const PER_MIN = 0.32;

export function calculateFare(input: FareInput): number {
  const { zoneId, distanceKm, durationMin, surgeMultiplier } = input;
  const subtotal = BASE_FARE + PER_KM * distanceKm + PER_MIN * durationMin;
  const originalFare = subtotal * surgeMultiplier;
  if (!isEnabled("pricing_min_fare", { zoneId })) return originalFare;

  const minFare = getPricingLimit("min_fare", { zoneId });
  const fare = Math.max(originalFare, minFare);
  if (fare > originalFare) {
    logger.info("pricing.override", {
      zoneId: zoneId ?? null,
      originalValue: originalFare,
      appliedValue: fare,
    });
  }
  return fare;
}
