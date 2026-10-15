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
  return subtotal * surgeMultiplier;
}
