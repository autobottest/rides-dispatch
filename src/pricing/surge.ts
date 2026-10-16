import { logger } from "../lib/logger";
import { isEnabled } from "../lib/flags";
import { AIRPORT_ZONES } from "../../generated/pricingZones.gen";

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
/** Maximum surge allowed for airport pickups (RIDE-1). */
export const AIRPORT_SURGE_CAP = 2.0;

export function surgeMultiplier(input: SurgeInput): number {
  const { zoneId, demand, supply, riderId } = input;
  if (supply <= 0) return applyAirportCap(input, MAX_MULTIPLIER);

  const ratio = demand / supply;
  const raw = 1 + Math.max(0, ratio - 1) * 0.5;
  const multiplier = applyAirportCap(input, round2(clamp(raw, MIN_MULTIPLIER, MAX_MULTIPLIER)));

  logger.info("surge.computed", { zoneId, riderId, multiplier });
  return multiplier;
}

function applyAirportCap(input: SurgeInput, multiplier: number): number {
  if (!isEnabled("airport_surge_cap", { zoneId: input.zoneId })) return multiplier;
  if (!AIRPORT_ZONES.has(input.zoneId)) return multiplier;

  const capped = Math.min(multiplier, AIRPORT_SURGE_CAP);
  logger.debug("surge.airport_cap_check", {
    zoneId: input.zoneId,
    riderId: input.riderId,
    riderPhone: input.riderPhone,
    multiplier: capped,
  });
  return capped;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
