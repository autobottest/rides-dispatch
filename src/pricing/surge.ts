import { logger } from "../lib/logger";

export interface SurgeInput {
  zoneId: string;
  /** Open ride requests in the zone. */
  demand: number;
  /** Available drivers in the zone. */
  supply: number;
  riderId: string;
  riderPhone?: string;
}

export const MIN_MULTIPLIER = 1.0;
export const MAX_MULTIPLIER = 4.0;

export function surgeMultiplier(input: SurgeInput): number {
  const { zoneId, demand, supply, riderId } = input;
  if (supply <= 0) return MAX_MULTIPLIER;

  const ratio = demand / supply;
  const raw = 1 + Math.max(0, ratio - 1) * 0.5;
  const multiplier = round2(clamp(raw, MIN_MULTIPLIER, MAX_MULTIPLIER));

  logger.info("surge.computed", { zoneId, riderId, multiplier });
  return multiplier;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
