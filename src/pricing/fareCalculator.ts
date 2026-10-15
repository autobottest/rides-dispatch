export interface FareInput {
  distanceKm: number;
  durationMin: number;
  surgeMultiplier: number;
}

export const BASE_FARE = 2.5;
export const PER_KM = 1.15;
export const PER_MIN = 0.32;

export function calculateFare(input: FareInput): number {
  validate(input);
  const { distanceKm, durationMin, surgeMultiplier } = input;
  const subtotal = BASE_FARE + PER_KM * distanceKm + PER_MIN * durationMin;
  return subtotal * surgeMultiplier;
}

function validate({ distanceKm, durationMin, surgeMultiplier }: FareInput): void {
  if (!Number.isFinite(distanceKm) || distanceKm < 0) {
    throw new RangeError(`distanceKm must be a non-negative number, got ${distanceKm}`);
  }
  if (!Number.isFinite(durationMin) || durationMin < 0) {
    throw new RangeError(`durationMin must be a non-negative number, got ${durationMin}`);
  }
  if (!Number.isFinite(surgeMultiplier) || surgeMultiplier < 1) {
    throw new RangeError(`surgeMultiplier must be >= 1, got ${surgeMultiplier}`);
  }
}
