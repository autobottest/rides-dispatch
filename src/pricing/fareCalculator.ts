import { getPricingLimit } from "../config/pricingLimits";

export interface FareInput {
  distanceKm: number;
  durationMin: number;
  surgeMultiplier: number;
}

export const BASE_FARE = 2.5;
export const PER_KM = 1.15;
export const PER_MIN = 0.32;

export function calculateFare(input: FareInput): number {
  const { distanceKm, durationMin, surgeMultiplier } = input;
  const subtotal = BASE_FARE + PER_KM * distanceKm + PER_MIN * durationMin;
  const minFare = getPricingLimit("min_fare");
  // RIDE-21: no completed trip is charged less than the configured minimum fare.
  return Math.max(subtotal * surgeMultiplier, minFare);
}
